import OriginalPost from "../OriginalPost.jsx";

describe("OriginalPost", () => {
	it("renders correctly",() => {
		const p = {postContent : "a"};
		const op = renderer.create(
			<OriginalPost original_post={p}/>
			);
		expect(op).toMatchSnapshot();
	});
});