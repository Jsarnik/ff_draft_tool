
const config = {
    baseApiUri: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'ec2-34-216-74-242.us-west-2.compute.amazonaws.com:3001'
};

export default config;
