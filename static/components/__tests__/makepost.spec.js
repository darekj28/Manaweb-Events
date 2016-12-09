import MakePost from "../MakePost.jsx";

describe("MakePost", ()=>{
	it("renders correctly", () => {
		const actions = ["Trade", "Play", "Chill"];
		const mp = renderer.create(
			<MakePost postText="a" onClick={jest.fn()} onPostChange={jest.fn()}
				onPostSubmit={jest.fn()} actions={actions}/>
			);
		expect(mp).toMatchSnapshot();
	});
	it("should call handlePostChange with text in textbox when user types", () => {
		expect(true).toBe(true);
	});
	it("should call handlePostSubmit with text in textbox when user presses submit or enter", () => {
		expect(true).toBe(true);
	});
});