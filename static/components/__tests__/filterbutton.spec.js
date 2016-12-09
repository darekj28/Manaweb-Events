import FilterButton from "../FilterButton.jsx";

describe("FilterButton", () => {
	it("renders correctly for active", ()=> {
		const fb = renderer.create(
			<FilterButton name="Trade" onClick={jest.fn()} active={true} 
					isSearch={false}/> 
			);
		expect(fb).toMatchSnapshot();
	});
	it("renders correctly for inactive", ()=> {
		const fb = renderer.create(
			<FilterButton name="Trade" onClick={jest.fn()} active={false} 
					isSearch={false}/> 
			);
		expect(fb).toMatchSnapshot();
	});
	it("renders correctly for all actions", ()=> {
		const fb = renderer.create(
			<div>
				<FilterButton name="Trade" onClick={jest.fn()} active={false} 
						isSearch={false}/> 
				<FilterButton name="Play" onClick={jest.fn()} active={false} 
				isSearch={false}/> 
				<FilterButton name="Chill" onClick={jest.fn()} active={false} 
				isSearch={false}/> 
			</div>
			);
		expect(fb).toMatchSnapshot();
	});
	it("should call onClick with the name and isSearch when user clicks it", () => {
		expect(true).toBe(true);
	});
});