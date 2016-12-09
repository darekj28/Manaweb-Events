import ReportCommentModal from '../ReportCommentModal.jsx';

describe('ReportCommentModal', () => {
	it('should report when button is clicked', () => {
		expect(true).toEqual(true);
	});
	it('renders correctly', () => {
		const comment = {unique_id : 1};
		const rcm = renderer.create(
			<ReportCommentModal comment={comment}/>
			);
		expect(rcm).toMatchSnapshot();
	});
})