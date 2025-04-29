import Quill from 'quill';

const Tooltip = () => {
    if (typeof window !== 'undefined') {
        const TooltipModule = function (quill, options) {
            this.quill = quill;
            this.tooltip = document.createElement('div');
            this.tooltip.classList.add('custom-tooltip');
            document.body.appendChild(this.tooltip);

            this.quill.on('text-change', () => {
                const range = this.quill.getSelection();
                if (range) {
                    const tooltipText = this.getTooltipText(range);
                    if (tooltipText) {
                        this.showTooltip(tooltipText, range);
                    } else {
                        this.hideTooltip();
                    }
                }
            });
        };

        TooltipModule.prototype.showTooltip = function (text, range) {
            const bounds = this.quill.getBounds(range);
            this.tooltip.innerText = text;
            this.tooltip.style.top = `${bounds.top + window.scrollY - 40}px`;
            this.tooltip.style.left = `${bounds.left + window.scrollX}px`;
            this.tooltip.style.display = 'block';
        };

        TooltipModule.prototype.hideTooltip = function () {
            this.tooltip.style.display = 'none';
        };

        TooltipModule.prototype.getTooltipText = function (range) {
            // Customize this function to return different tooltip text based on the selection
            return this.quill.getText(range.index, range.length).trim();
        };

        Quill.register('modules/tooltip', TooltipModule);
    }
};

export default Tooltip;
