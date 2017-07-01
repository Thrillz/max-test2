import { Ng2FormsPage } from './app.po';

describe('ng2-forms App', () => {
  let page: Ng2FormsPage;

  beforeEach(() => {
    page = new Ng2FormsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
