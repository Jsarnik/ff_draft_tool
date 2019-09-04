const config = {
    baseApiUri: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://espn-fantasy-tool.herokuapp.com/'
};

export default config;
