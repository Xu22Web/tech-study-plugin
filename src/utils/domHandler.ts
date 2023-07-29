import Protocal, { Protocol } from 'devtools-protocol';

/**
 * @description 获取文档节点
 * @param tabId
 * @param params
 */
async function getDocument(
  tabId: number,
  params?: Protocal.DOM.GetDocumentRequest
) {
  return <Protocal.DOM.GetDocumentResponse>(
    await chrome.debugger.sendCommand({ tabId }, 'DOM.getDocument', params)
  );
}

/**
 * @description 查询选择器节点
 * @param tabId
 * @param params
 */
async function querySelector(
  tabId: number,
  params: Protocal.DOM.QuerySelectorRequest
) {
  return <Protocal.DOM.QuerySelectorResponse>(
    await chrome.debugger.sendCommand({ tabId }, 'DOM.querySelector', params)
  );
}

/**
 * @description 查询所有选择器节点
 * @param tabId
 * @param params
 */
async function querySelectorAll(
  tabId: number,
  params: Protocal.DOM.QuerySelectorAllRequest
) {
  return <Protocal.DOM.QuerySelectorAllResponse>(
    await chrome.debugger.sendCommand({ tabId }, 'DOM.querySelectorAll', params)
  );
}

/**
 * @description 获取盒模型
 * @param tabId
 * @param params
 */
async function getBoxModel(
  tabId: number,
  params: Protocal.DOM.GetBoxModelRequest
) {
  return <Protocal.DOM.GetBoxModelResponse>(
    await chrome.debugger.sendCommand({ tabId }, 'DOM.getBoxModel', params)
  );
}

/**
 * @description 聚焦元素
 * @param tabId
 * @param params
 * @returns
 */
async function focus(tabId: number, params: Protocal.DOM.FocusRequest) {
  return await chrome.debugger.sendCommand({ tabId }, 'DOM.focus', params);
}

/**
 * @description 创建dom处理
 * @param tabId
 * @returns
 */
function createDOMHandler(tabId: number) {
  return {
    getDocument(params?: Protocal.DOM.GetDocumentRequest) {
      return getDocument(tabId, params);
    },
    querySelector(params: Protocal.DOM.QuerySelectorRequest) {
      return querySelector(tabId, params);
    },
    querySelectorAll(params: Protocol.DOM.QuerySelectorAllRequest) {
      return querySelectorAll(tabId, params);
    },
    getBoxModel(params: Protocal.DOM.GetBoxModelRequest) {
      return getBoxModel(tabId, params);
    },
    focus(params: Protocal.DOM.FocusRequest) {
      return focus(tabId, params);
    },
  };
}

/**
 * @description 创建文档处理
 * @param tabId
 * @param params
 * @returns
 */
async function createDocumentHandler(
  tabId: number,
  params?: Protocal.DOM.GetDocumentRequest
) {
  // dom处理
  const { getDocument, querySelector, querySelectorAll, getBoxModel, focus } =
    createDOMHandler(tabId);
  // 文档id
  const {
    root: { nodeId },
  } = await getDocument(params);
  return {
    querySelector(selector: string) {
      return querySelector({ nodeId, selector });
    },
    querySelectorAll(selector: string) {
      return querySelectorAll({ nodeId, selector });
    },
    getBoxModel(nodeId: number) {
      return getBoxModel({ nodeId });
    },
    focus(nodeId) {
      return focus({ nodeId });
    },
  };
}

export {
  createDOMHandler,
  createDocumentHandler,
  getBoxModel,
  getDocument,
  querySelector,
  querySelectorAll,
};
