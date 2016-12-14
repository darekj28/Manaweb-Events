import DeleteCommentModal from '../DeleteCommentModal.jsx';

describe('DeleteCommentModal', () => {
	it('should call handleCommentDelete when yes is clicked', () => {
		window.$ = {ajax: jest.fn()}
		const refreshFeed = jest.fn();
		const comment = {unique_id : 1};
		const wrapper = mount(
			<DeleteCommentModal comment={comment} refreshFeed={refreshFeed}/>
			);
		const btn = wrapper.find('#dcm_yes');
		btn.simulate('click');
		expect(refreshFeed).toHaveBeenCalled();
	});
	it('renders correctly', () => {
		const refreshFeed = jest.fn();
		const comment = {unique_id : 1};
		const dcm = renderer.create(
			<DeleteCommentModal comment={comment} refreshFeed={refreshFeed}/>
			);
		expect(dcm).toMatchSnapshot();
	});
})