/**
 * 获取当前页面所在的技术分类
 * 
 * @param {*} category 技术大类
 * @param {*} technology 具体技术分类
 */
function getCategoryAndTechnoloyName(category, technology) {
    let data = require("../server/data/CategoryAndTechnology.js");
    if (!technology) {
        let len = category.length;
        for (let i = 0; i < data.length; i++) {
            if (data[i].name.substr(0, len) == category) {
                return {
                    "category": data[i].category,
                    "nth": i,
                    "path1": category,
                }
            }
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            if (data[i].name == (category + technology)) {
                return {
                    "category": data[i].category,
                    "technology": data[i].technology,
                    "nth": i,
                    "path1": category,
                    "path2": category + "/" + technology,
                }
            }
        }
    }
}

module.exports = {
    getCategoryAndTechnoloyName: getCategoryAndTechnoloyName,
}