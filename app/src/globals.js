const config = {
    baseApiUri: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://localhost:3001'
};

export default config;
