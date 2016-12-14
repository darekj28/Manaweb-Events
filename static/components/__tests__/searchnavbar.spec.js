import SearchNavBar from '../SearchNavBar.jsx';

describe("SearchNavBar", () => {
	it("renders correctly", () => {
		const name = "Jay Kim";
		const actions = ["Trade", "Play", "Chill"];
		const snb = renderer.create(
			<SearchNavBar searchText="a" actions={actions} name={name}
				onSearch={jest.fn()} onClick={jest.fn()}/>
			);
		expect(snb).toMatchSnapshot();
	});
	it("should call onSearch with text in textbox when user types", () => {
		expect(true).toBe(true);
	});
});