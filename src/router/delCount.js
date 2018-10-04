var list = [];
function result(data,val){
  if(!val) list = [];
  if(!data.children){
    list.push(data._id);
    return list
  }
  list.push(data._id);
  for(var i = 0;i<data.children.length;i++){
    result(data.children[i],1)
  }
  return list
}

export default result
