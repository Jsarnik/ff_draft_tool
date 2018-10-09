
const config = {
    baseApiUri: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://ec2-34-220-100-110.us-west-2.compute.amazonaws.com:3001'
};

export default config;
