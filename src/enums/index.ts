export enum MESSAGE_TYPES {
  INFORM_ANALYSIS = 'INFORM_ANALYSIS', // 通知开启监听
  SET_SWITCH = 'SET_SWITCH', // 通知插件开启
  GET_ANALYSIS_RES = 'GET_ANALYSIS_RES', // 通知调用后台接口分析
  ANALYSIS_RES = 'ANALYSIS_RES', // 通知后台接口分析结果
}
export enum ANALYSIS_RES {
  SECURITY = 0,
  UNSECURITY = 1,
}
