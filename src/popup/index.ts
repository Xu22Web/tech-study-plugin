import MessageWrap from '../components/MessageWrap';
import Panel from '../components/Panel';
import { mountElement } from '../utils/element';
import './index.less';

mountElement(MessageWrap());

mountElement(Panel(), document.querySelector('#app'));
