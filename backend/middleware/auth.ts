import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

function authenticateToken(req: Request, res: Response, next: NextFunction): void {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        res.status(401).json({ error: 'No token provided' })
        return
    }
    
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {

        if (err) { 
            res.status(403).json({ error: 'Invalid token' })
            return
        }
        (req as any).user = user
        next()
    })
}
export default authenticateToken 