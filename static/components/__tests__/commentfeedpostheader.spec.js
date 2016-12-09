import CommentFeedPostHeader from "../CommentFeedPostHeader.jsx";

describe("CommentFeedPostHeader", () => {
	it("renders correctly for isOP", () => {
		const comment = {
			name : "a",
			userID : "a",
			time : "a"
		};
		const cfph = renderer.create(
			<CommentFeedPostHeader name={comment.name} userID={comment.userID} time={comment.time}
				isOP={true} isAdmin={false} handleCommentEdit={jest.fn()}
				handleCommentDelete={jest.fn()} handleCommentReport={jest.fn()}
				isOriginalPost={false}/>
			);
		expect(cfph).toMatchSnapshot();
	});
	it("renders correctly for isAdmin", () => {
		const comment = {
			name : "a",
			userID : "a",
			time : "a"
		};
		const cfph = renderer.create(
			<CommentFeedPostHeader name={comment.name} userID={comment.userID} time={comment.time}
				isOP={false} isAdmin={true} handleCommentEdit={jest.fn()}
				handleCommentDelete={jest.fn()} handleCommentReport={jest.fn()}
				isOriginalPost={false}/>
			);
		expect(cfph).toMatchSnapshot();
	});
	it("renders correctly for not isOP or isAdmin", () => {
		const comment = {
			name : "a",
			userID : "a",
			time : "a"
		};
		const cfph = renderer.create(
			<CommentFeedPostHeader name={comment.name} userID={comment.userID} time={comment.time}
				isOP={false} isAdmin={false} handleCommentEdit={jest.fn()}
				handleCommentDelete={jest.fn()} handleCommentReport={jest.fn()}
				isOriginalPost={false}/>
			);
		expect(cfph).toMatchSnapshot();
	});
	it("renders correctly for original post", () => {
		const comment = {
			name : "a",
			userID : "a",
			time : "a"
		};
		const cfph = renderer.create(
			<CommentFeedPostHeader name={comment.name} userID={comment.userID} time={comment.time}
				isOP={false} isAdmin={false} handleCommentEdit={jest.fn()}
				handleCommentDelete={jest.fn()} handleCommentReport={jest.fn()}
				isOriginalPost={true}/>
			);
		expect(cfph).toMatchSnapshot();
	});
});