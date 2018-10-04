function dataes(data){
  function results(val,parent){
    if(val == 0){
      return results(1,parent)
    }
    if(val == 3){
      return val
    }
    for(var i = 0;i<data.length;i++){
      if(data[i].parentId == parent._id){
        if(!parent.children) parent.children = []
        results(data[i].rank+1,data[i])
        parent.children.push(data[i]);
      }
    }
    return parent
  }

  function resultes(){
    var result = [];
    for(var i = 0;i<data.length;i++){
      if(data[i].rank == 0) result.push(results(0,data[i]));
    };
    return result
  }
  return resultes()
}


export default dataes
