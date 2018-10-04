const obj = function(val){
  var get = function get(){
    return val;
  };
  var set = function set(values){
    val = values
  }
  return {
    get,set
  }
}()
export default obj
