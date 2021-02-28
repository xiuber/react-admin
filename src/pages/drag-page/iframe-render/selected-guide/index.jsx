import {useEffect} from 'react';
import config from 'src/commons/config-hoc';
import styles from './style.less';
import {getComponentDisplayName} from 'src/pages/drag-page/component-config';

export default config({
    connect: state => {
        return {
            selectedNode: state.dragPage.selectedNode,
            iframeDocument: state.dragPage.iframeDocument,
        };
    },
})(function SelectedGuide(props) {
    const {selectedNode, iframeDocument} = props;

    useEffect(() => {
        if (!iframeDocument) return;

        // 清除选中指引
        const oldEle = iframeDocument.querySelector(`.${styles.root}`);
        if (oldEle) oldEle.classList.remove(styles.root);
        if (oldEle) oldEle.classList.remove(styles.position);

        const tagEle = iframeDocument.querySelector(`.${styles.tag}`);
        if (tagEle) tagEle.remove();

        if (!selectedNode) return;

        const {id} = selectedNode;

        let target = iframeDocument.querySelector(`[data-component-id="${id}"]`);
        if (target) target = iframeDocument.querySelector(`.id_${id}`);

        if (!target) return;

        // 判断是否有定位，没有添加相对定位，tag定位会用到
        const targetStyle = window.getComputedStyle(target);
        if (targetStyle.position === 'static') {
            target.classList.add(styles.position);
        }

        target.classList.add(styles.root);

        // 太小就不显示tag
        const rect = target.getBoundingClientRect();
        if (rect.width < 50) return;

        // 添加额外标签显示 tab，占用 before 或 after 可能跟原有元素有冲突
        const tag = iframeDocument.createElement('div');
        tag.classList.add(styles.tag);
        tag.innerHTML = getComponentDisplayName(selectedNode);
        target.appendChild(tag);

    }, [selectedNode, iframeDocument]);

    return null;
});
