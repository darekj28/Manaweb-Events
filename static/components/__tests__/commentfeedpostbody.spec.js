import CommentFeedPostBody from "../CommentFeedPostBody.jsx";

describe("CommentFeedPostBody", () => {
	it("renders correctly for original post", () => {
		const cfpb = renderer.create(
			<CommentFeedPostBody content="a" isOriginalPost={true}/>
			);
		expect(cfpb).toMatchSnapshot();
	});
	it("renders correctly for not original post", () => {
		const cfpb = renderer.create(
			<CommentFeedPostBody content="a" isOriginalPost={false}/>
			);
		expect(cfpb).toMatchSnapshot();
	});
});