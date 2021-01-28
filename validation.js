// const validate = validations => {
//     return async (req, res, next) => {
//       await Promise.all(validations.map(validation => validation.run(req)));
  
//       const errors = validationResult(req);
//       if (errors.isEmpty()) {
//         return next();
//       }
  
//       res.status(400).json({ errors: errors.array() });
//     };
//   };
// export const validateRule = validate(checkSchema({
//     rule: {
//         in: 'body',
//         isObject,
//         contains: '',
//         custom: {
//             options: (value) => {
//                 const properties = ['field', 'condition', 'condition_value'];
//                 properties.forEach(property => {
//                     if (!value.hasOwnProperty(property)) {
//                         throw new Error(`the field ${property} is missing`)
//                     }
//                 })
//                 if (!(value.condition === ('eq' || 'neq' || 'gt' || 'gte'))) {
//                     throw new Error(`invalid rule condition`);
//                 }
//             }
//         }
//     } 
// }))
const isString = (value) => {
    return typeof value === 'string' || value instanceof String;
}

const isArray = (value) => {
    return value && typeof value ==='object' && value.constructor === Array;
}

const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object;
} 



module.exports.validateRule = (req, res, next) => {
    const { rule } = req.body
    if (rule) {
        if (!isObject(rule)) {
            return res.status(400).json({
                message: "rule should be an object.",
                status: "error",
                data: null
            })
        }
        const properties = ['field', 'condition', 'condition_value'];
        properties.forEach(property => {
            if (!rule.hasOwnProperty(property)) {
                return res.status(400).json({
                    message: `the rule field ${property} is missing`,
                    status: 'error',
                    data: null
                })
            }
        });
        // const conditions = 'eq' || 'neq' || 'gt' || 'gte' || 'contains'
        // if (rule.condition !== condition) {
        //     return res.status(400).json({
        //         message: "invalid rule condition value.",
        //         status: "error",
        //         data: null
        //     })
        // }
        

        return next();

    } else {
        return res.status(400).json({
            message: "rule is required.",
            status: "error",
            data: null
        })
    }
}

module.exports.validateData = (req, res, next) => {
    const { rule, data } = req.body
    console.log('i got here')
    if (data) {
        if (isObject(data) || isArray(data) || isString(data)) {
            if(data[rule.field]) {
                console.log('i reached here')
                return next()
            } else {
                return res.status(400).json({
                    message: `field ${rule.field} is missing from data.`,
                    status: 'error',
                    data: null
                })
            }
        } else {
            return res.status(400).json({
                message: 'data can only be either an object, an array or a string.',
                status: 'error',
                data: null
            })
        }
    } else {
        return res.status(400).json({
            message: "data is required.",
            status: "error",
            data: null
        })
    }
}

module.exports.validated = (req, res) => {
    const { rule, data } = req.body;
    
    const validationPassed = (field, field_value, condition, condition_value) => {
        return res.status(200).json({
            message: `field ${field} successfully validated.`,
            status: "success",
            data: {
                validation: {
                error: false,
                field,
                field_value,
                condition,
                condition_value
                }
            }
        })
    }

    const validationFailed = (field, field_value, condition, condition_value) => {
        return res.status(400).json({
            message: `field ${field} failed validation.`,
            status: "error",
            data: {
                validation: {
                error: true,
                field,
                field_value,
                condition,
                condition_value
                }
            }
        })
    }

    switch (rule.condition) {
        case "eq":
            if (rule.condition_value === data[rule.field]) {
                validationPassed(rule.field, data[rule.field], rule.condition, rule.condition_value)
            } else {
                validationFailed(rule.field, data[rule.field], rule.condition, rule.condition_value)
            };
            break;
        case "neq":
            if (!(rule.condition_value === data[rule.field])) {
                validationPassed(rule.field, data[rule.field], rule.condition, rule.condition_value)
            } else {
                validationFailed(rule.field, data[rule.field], rule.condition, rule.condition_value)
            };
            break;
        case "gt":
            if ( data[rule.field] > rule.condition_value) {
                validationPassed(rule.field, data[rule.field], rule.condition, rule.condition_value)
            } else {
                validationFailed(rule.field, data[rule.field], rule.condition, rule.condition_value)
            };
            break;
        case "gte":
            if ( data[rule.field] >= rule.condition_value) {
                validationPassed(rule.field, data[rule.field], rule.condition, rule.condition_value)
            } else {
                validationFailed(rule.field, data[rule.field], rule.condition, rule.condition_value)
            };
            break;
        case "contains":
            if ( data[rule.field].contains(rule.condition_value) ) {
                validationPassed(rule.field, data[rule.field], rule.condition, rule.condition_value)
            } else {
                validationFailed(rule.field, data[rule.field], rule.condition, rule.condition_value)
            };
            break;
        default:
            return res.status(400).json({
                message: "invalid rule condition value.",
                status: "error",
                data: null
            })
    }

    //'eq' || 'neq' || 'gt' || 'gte'
}