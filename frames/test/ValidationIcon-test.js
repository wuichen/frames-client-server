var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
import should from 'should';
var expect = require('expect');


describe('ValidationIcon', () => {
  var ValidationIcon;

  beforeEach(() => {
    ValidationIcon = require('../app/js/components/ValidationIcon')
  });

  it('should exists', () => {
      var validationIcon = TestUtils.renderIntoDocument(<ValidationIcon/>);
      expect(TestUtils.isCompositeComponent(validationIcon)).toBeTruthy();
  });

  // it('should have a fontawesome element in it', () => {
  //     var validationIcon = TestUtils.renderIntoDocument(<ValidationIcon/>);

  //     var fontawesome = TestUtils.findRenderedDOMComponentWithClass(validationIcon, 'fontAwesome');
  //     expect(TestUtils.isCompositeComponent(fontawesome)).toBeTruthy();
  // });
  describe('which fontawesome icon was generated', () => {

      it('should have a green check fontawesome element in it', () => {
          var validationIcon = TestUtils.renderIntoDocument(<ValidationIcon isValid='greenCheck'/>);

          var fontawesome = TestUtils.findRenderedDOMComponentWithClass(validationIcon, 'fontAwesome');
          expect(TestUtils.isCompositeComponent(fontawesome)).toBeTruthy();
          fontawesome.props.name.should.eql("check");
          fontawesome.props.style.color.should.eql("green");


      });
      it('should have a uncheck fontawesome element in it', () => {
          var validationIcon = TestUtils.renderIntoDocument(<ValidationIcon isValid='redCross'/>);

          var fontawesome = TestUtils.findRenderedDOMComponentWithClass(validationIcon, 'fontAwesome');
          expect(TestUtils.isCompositeComponent(fontawesome)).toBeTruthy();
          fontawesome.props.name.should.eql("times");
          fontawesome.props.style.color.should.eql("red");


      });
      it('should have a grey check fontawesome element in it', () => {
          var validationIcon = TestUtils.renderIntoDocument(<ValidationIcon />);

          var fontawesome = TestUtils.findRenderedDOMComponentWithClass(validationIcon, 'fontAwesome');
          expect(TestUtils.isCompositeComponent(fontawesome)).toBeTruthy();
          fontawesome.props.name.should.eql("check");
          fontawesome.props.style.color.should.eql("#C0C0C0");

      });
      it('should have a yellow warning fontawesome element in it', () => {
          var validationIcon = TestUtils.renderIntoDocument(<ValidationIcon isValid='yellowWarning' />);

          var fontawesome = TestUtils.findRenderedDOMComponentWithClass(validationIcon, 'fontAwesome');
          expect(TestUtils.isCompositeComponent(fontawesome)).toBeTruthy();
          fontawesome.props.name.should.eql("warning");
          fontawesome.props.style.color.should.eql("orange");

      });
      it('should have a transparent check fontawesome element in it', () => {
          var validationIcon = TestUtils.renderIntoDocument(<ValidationIcon isValid='white' />);

          var fontawesome = TestUtils.findRenderedDOMComponentWithClass(validationIcon, 'fontAwesome');
          expect(TestUtils.isCompositeComponent(fontawesome)).toBeTruthy();
          fontawesome.props.name.should.eql("times");
          fontawesome.props.style.color.should.eql("white");

      });


  });
});
