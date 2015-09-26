var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
import should from 'should';
var expect = require('expect');

var question = {
    id: 1,
    isValid: {},
    possibleanswers: [{answerId:'a',displayText:'a'},{answerId:'b',displayText:'b'},{answerId: 'c',displayText:'c'}],
    question: 'ReceiptEligibility',
    resultId: 'a'
}


describe('RadioValidation', () => {
  var RadioValidation;
  var ValidationIcon;
  beforeEach(() => {
    RadioValidation = require('../app/js/components/RadioValidation')
    ValidationIcon = require('../app/js/components/ValidationIcon')
  });

  it('should exists', () => {
      var radioValidation = TestUtils.renderIntoDocument(<RadioValidation question={question} />);
      expect(TestUtils.isCompositeComponent(radioValidation)).toBeTruthy();
  });
  describe('RadioValidation title', () => {
      it('renders the title with validationicon when the question is not disabled', () => {

          var radioValidation = TestUtils.renderIntoDocument(<RadioValidation question={question} disabled={false}/>);
          var validationIcon = TestUtils.scryRenderedComponentsWithType(radioValidation, ValidationIcon);
          expect(validationIcon.length).toBeGreaterThan(0);
      })
      it('renders the title with validationicon when the question is disabled', () => {

          var radioValidation = TestUtils.renderIntoDocument(<RadioValidation question={question} disabled={true}/>);
          var validationIcon = TestUtils.scryRenderedComponentsWithType(radioValidation, ValidationIcon);
          expect(validationIcon.length).toBeLessThan(1);
        })
  })
  describe('RadioValidation answers', () => {
      it('should have 3 selectable answers', () => {
          var radioValidation = TestUtils.renderIntoDocument(<RadioValidation question={question} />);
          var inputs = TestUtils.scryRenderedDOMComponentsWithClass(radioValidation,'answerFont')
          expect(inputs.length).toBe(3)
      })
  })
  describe('RadioValidation answers', () => {
      it('should have checked answers', () => {
          var radioValidation = TestUtils.renderIntoDocument(<RadioValidation question={question} />);
          var inputs = TestUtils.scryRenderedDOMComponentsWithClass(radioValidation,'inputIcon');
          var count = 0;
          for(var i=0; i<=inputs.length-1;i++){
              if(inputs[i].props.answerId === question.resultId){
                count++;
              }
          }
          expect(count).toBe(1);
      })
      it('all input disabled', () => {
          var radioValidation = TestUtils.renderIntoDocument(<RadioValidation question={question} disabled={true} />);
          var inputs = TestUtils.scryRenderedDOMComponentsWithClass(radioValidation,'inputIcon');
          var count = 0;
          for(var i=0; i<=inputs.length-1;i++){
              count++
          }
          expect(count).toBe(inputs.length);
      })
  })
});