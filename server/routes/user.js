const { PrismaClient } = require('@prisma/client')
const express = require('express')
const jwt = require('jsonwebtoken');
const client = new PrismaClient()
const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const { email, password, role, orgName } = req.body

        if (!email || !password || !role || !orgName) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all fields'
            })
        }
        const org = await client.organization.create({
            data: {
                org_name: orgName
            },
            select: {
                id: true
            }
        })
        const user = await client.user.create({
            data: {
                email,
                password,
                role,
                orgId: org.id,
            }
        })
        if (user) {
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                user
            })
        }
    } catch (error) {
        console.error('Register error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all fields'
            });
        }

        const user = await client.user.findFirst({
            where: {
                email,
                password
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set JWT as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});



module.exports = router