export default class JsonManage {
    constructor() {}

    classToTextToJson(data) {
        return JSON.parse(JSON.stringify(data));
    }
};