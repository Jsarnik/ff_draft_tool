
const config = {
    baseApiUri: process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : 'http://ec2-54-187-232-37.us-west-2.compute.amazonaws.com:3001'
};

export default config;
