const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { PutObjectCommand, GetObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const client = new PrismaClient()
const coursesRouter = express.Router()

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    },
    region: process.env.AWS_REGION
});


coursesRouter.get('/', async (req, res) => {
    try {
        const courses = await client.course.findMany()
        res.status(200).json({
            success: true,
            courses
        })
    } catch (error) {
        console.error('Get courses error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

coursesRouter.post('/get-presigned-url', async (req, res) => {
    const { courseName, fileType, fileName, websiteUrl } = req.body;
    let course,presignedUrl;

    if (websiteUrl) {
        try {
            const response = await fetch('http://localhost:8000/process/website', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "url": websiteUrl
                })
            })
            const data = await response.json()
            course = await client.course.create({
                data: {
                    name: courseName,
                    json: data
                }
            })
        } catch (error) {
            console.error('Website processing error:', error);
            return res.status(500).json({ error: 'Failed to process website' });
        }
    } else {
        if (!fileType || !courseName) {
            return res.status(400).json({ error: 'Filetype and course name is required' });
        }

        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `${fileName}`,
            ContentType: fileType
        };

        try {
            const command = new PutObjectCommand(params);
            presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
            const s3Url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

            course = await client.course.create({
                data: {
                    name: courseName,
                    s3_uri: s3Url,
                    json: null
                }, select: {
                    id: true
                }
            })
        } catch (error) {
            console.error('Presigned URL generation error:', error);
            res.status(500).json({ error: 'Failed to generate presigned URL' });
        }
    }

    await client.user.update({
        where: { id: req.user.id },
        data: {
            courses: {
                push: {
                    id: course.id
                }
            }
        }
    })

    return res.json({
        success: true,
        presignedUrl,
        s3Url,
        courseId: course.id
    });

});

coursesRouter.post('/create/pathway', async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ error: 'Course ID is required' });
    }

    try {
        const courseExists = await client.course.findUnique({
            where: { id },
            select: {
                s3_uri: true
            }
        });

        if (!courseExists) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        const response = await fetch('http://localhost:8000/process/s3', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "url": courseExists.s3_uri
            })
          })

        const data = await response.json();

        await client.course.update({
            where: { id: id },
            data: { json: data }
        })

        return res.json({
            success: true,
            message: 'Pathway created successfully'
        });
    } catch (error) {
        console.error('Create pathway error:', error);
        res.status(500).json({ error: 'Failed to create pathway' });
    }
})



module.exports = coursesRouter