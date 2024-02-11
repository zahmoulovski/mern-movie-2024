const modelOptions = {
    toJSON: {
        virtuals: true,
        tranform: (_obj) => {
            delete obj._id;
            return obj
        }
    },
    toObject: {
        virtuals: true,
        tranform: (_obj) => {
            delete obj._id;
            return obj
        }
    },
    versionKey: false,
    timestamp:true,
}

export default modelOptions;