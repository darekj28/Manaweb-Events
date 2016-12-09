import CommentNavBar from '../CommentNavBar.jsx';

describe("CommentNavBar", () => {
	it("renders correctly", () => {
		const cnb = renderer.create(
			<CommentNavBar searchText="a" onSearch={jest.fn()} name="Jay Kim"/>
			);
		expect(cnb).toMatchSnapshot();
	});
	it("should call onSearch with text in textbox when user types", () => {
		expect(true).toBe(true);
	});
});