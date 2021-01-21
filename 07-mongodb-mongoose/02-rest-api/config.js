module.exports = {
    mongodb: {
        uri:
            process.env.NODE_ENV === 'test'
                ? 'mongodb://localhost/any-shop'
                : 'mongodb://localhost/6-module-2-task',
    },
};
