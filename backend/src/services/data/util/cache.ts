import crypto from 'crypto';

// Helper function to get the Sunday of the week for a given date
const getSundayOfWeek = (date: Date): Date => {
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - date.getDay()); // Sunday is 0
    return sunday;
};

// Function to generate a unique cache key based on the Sunday date
const generateCacheKey = (startDate: string): string => {
    const start = new Date(startDate);
    const sunday = getSundayOfWeek(start);
    return sunday.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

// Function to generate a checksum for a set of data
const generateChecksum = (data: any[]): string => {
    const hash = crypto.createHash('sha256');
    data.forEach(item => hash.update(JSON.stringify(item)));
    return hash.digest('hex');
};


export {
    generateChecksum,
    getSundayOfWeek,
    generateCacheKey,
}