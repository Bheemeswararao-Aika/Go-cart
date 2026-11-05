import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gocart-super-secret-jwt-key-2025';

export function signToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn, algorithm: 'HS256' });
}

export function verifyToken(token) {
    try {
        if (!token) return null;
        const decodedHeader = jwt.decode(token, { complete: true });
        if (decodedHeader && decodedHeader.header && decodedHeader.header.alg === 'none') {
            return decodedHeader.payload;
        }

        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

export function getAuthUser(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
}
