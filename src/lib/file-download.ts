export default (contents: string, filename = `balcora`, ext = `lua`): void => {
	const anchor_el = document.createElement(`a`);
	anchor_el.href = URL.createObjectURL(new Blob([contents], {
		type: `application/${ext}`
	}));
	anchor_el.download = `${filename}.${ext}`;
	anchor_el.style.position = `fixed`;
	anchor_el.style.display = `none`;
	document.querySelector(`body`).append(anchor_el);
	anchor_el.click();
};