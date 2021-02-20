import React from "react"
import PropTypes from "prop-types"
class Diary extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render () {
    const diaryList = [];
    for(let i = 0; i < this.props.value.length; i=i+2){
      if((this.props.value[i].created_at).match(this.props.day)){
        diaryList.push(
        <label key={"content-1-diary-label"+`${i}`} htmlFor={"content-1-diary"+`${i}`} className="diary-label"><a href={`/diaries/${this.props.value[i].id}`}>Q1</a></label>,
        <li key={"content-1-diary"+`${i}`} id={"content-1-diary"+`${i}`} className="diary-content">{this.props.value[i].content}</li>,
        <label key={"content-2-diary-label"+`${i+1}`} htmlFor={"content-2-diary"+`${i+1}`} className="diary-label"><a href={`/diaries/${this.props.value[i+1].id}`}>Q2</a></label>,
        <li key={"content-2-diary"+`${i+1}`} id={"content-2-diary"+`${i+1}`} className="diary-content">{this.props.value[i+1].content}</li>);
      }else{
        continue
      }};
    return (
      <div className="contents-posts">
        <div className="lists">
          <p id="post-title">日記</p>
        </div>
        <ul className="content-list">
          {diaryList}
        </ul>
      </div>
      );
  };
};
export default Diary
