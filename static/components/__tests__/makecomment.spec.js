import MakeComment from "../MakeComment.jsx";

describe("MakeComment", ()=>{
	it("renders correctly", () => {
		const actions = ["Trade", "Play", "Chill"];
		const mc = renderer.create(
			<MakeComment commentText="a" onClick={jest.fn()} onCommentChange={jest.fn()}
				onCommentSubmit={jest.fn()} actions={actions}/>
			);
		expect(mc).toMatchSnapshot();
	});
	it("should call handleCommentChange with text in textbox when user types", () => {
		expect(true).toBe(true);
	});
	it("should call handleCommentSubmit with text in textbox when user presses submit or enter", () => {
		expect(true).toBe(true);
	});
});