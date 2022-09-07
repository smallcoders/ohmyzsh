export default (param) => {
  const { relations = [], topicList = [], formInstance, relatedRelation } = param
  const conditions = []
  relations.forEach((relation) => {
    const { dependValue, dependIndex, conditionType } = relation
    const dependTopicInfo = topicList[dependIndex]
    const fieldValue = formInstance.getFieldValue([dependTopicInfo.id])
    if (dependTopicInfo.type == 'radio') {
      conditions.push(dependValue.includes(fieldValue))
    } else if (dependTopicInfo.type == 'checkbox') {
      const isIncludes = []
      for (let i = 0; i < dependValue.length; i++) {
        isIncludes.push(fieldValue ? fieldValue.includes(dependValue[i]) : false)
      }
      conditions.push(eval(isIncludes.join(` ${conditionType == 'all' ? '&&' : '||'} `)))
    }
  })
  const isTruth = eval(conditions.join(` ${relatedRelation == 'and' ? '&&' : '||'} `))
  return isTruth
}
