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

coursesRouter.post('/api/get-presigned-url', async (req, res) => {
    const { courseName, fileType } = req.body;

    if (!fileType || !courseName) {
        return res.status(400).json({ error: 'Filetype and course name is required' });
    }

    const fileName = `uploads/${Math.random().toString(36).substring(7)}`;
    const fileExtension = fileType.split('/')[1];
    const fullFileName = `${fileName}.${fileExtension}`;

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: fullFileName,
        ContentType: fileType
    };

    try {
        const command = new PutObjectCommand(params);
        const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        const getCommand = new GetObjectCommand(params);
        const viewUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

        await client.course.create({
            data: {
                name: courseName,
                s3_uri: viewUrl,
                json: null
            }, select: {
                id: true
            }
        })
        return res.json({
            success: true,
            presignedUrl,
            viewUrl,
        });
    } catch (error) {
        console.error('Presigned URL generation error:', error);
        res.status(500).json({ error: 'Failed to generate presigned URL' });
    }
});

coursesRouter.post('/create/pathway', async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ error: 'Course ID is required' });
    }

    try {
        const courseExists = await client.course.findUnique({
            where: { id }
        });

        if (!courseExists) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }
        await client.course.update({
            where: { id: id },
            data: { json: 'sometriggerpointtoimplmenet' }
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