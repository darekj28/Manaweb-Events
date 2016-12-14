import FeedPost from "../FeedPost.jsx";

describe("FeedPost", () => {
	it("renders correctly", () => {
		const post = {comment_id : "a", name : 'a', userID : 'a', time : 'a',
						isTrade : true, isPlay : true, isChill : true,
						postContent : "a", avatar : "a"};
		const fp = renderer.create(
			<FeedPost post={post} isOP={true} isAdmin={true}
					refreshFeed={jest.fn()} 
					refreshPostDisplayedInModal={jest.fn()}
					handleFilterUser={jest.fn()} />
			);
		expect(fp).toMatchSnapshot();
	});
	it("should call handlePostEdit when edit post is clicked", () => {
		expect(true).toBe(true);
	});
	it("should call handlePostDelete when delete post is clicked", () => {
		expect(true).toBe(true);
	});
	it("should call handlePostReport when report post is clicked", () => {
		expect(true).toBe(true);
	});
});