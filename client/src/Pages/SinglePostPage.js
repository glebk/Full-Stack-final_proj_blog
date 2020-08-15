import React from "react";
import {Link} from "react-router-dom";
import {getPost,deletePost,changePostPhase} from "../utils/server/Posts"
import {addComment} from "../utils/server/Comments"
import {makeComments} from "../utils/utils"

import '../styles/SinglePostPage.css';
import {faToggleOn} from "@fortawesome/free-solid-svg-icons";

class SinglePostPage extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null,
            comments:null,
            newComment:null,
            userWantToComment : false,
            userComment:false,
            resp:null,
            published:false,
            errMsg:'',
            liked:false,
        }
    }

    componentDidMount() {
        let postId = this.props.match.params.id
        getPost(postId)
            .then((res)=>{
                console.log(res.data.comments)
                this.setState({
                    post:res.data,
                    published: res.data.published ? true : false,
                    comments:res.data.comments,});
                console.log(res.data.comments)
            })
            .catch(()=>{
                this.setState({resp:"Something went wrong, try again please."})
            });
    }
    handleDelete=()=>{
        deletePost(this.state.post)
            .then((res)=>{
                this.props.history.push('/my posts');
                this.setState({resp:"Post Deleted!"})
            })
            .catch(()=>{
                this.setState({resp:"Something went wrong, try again please."})
            });
    }
    handleComment=(event)=>{
        this.setState({
            newComment: event.target.value
        })
    }
    handleSubmitComment=()=> {
        if (this.props.user.isLoggedIn) {
            let dataToSend = {
                postId: this.state.post.id,
                content: this.state.newComment,
                user_name: this.props.user.name
            }
            addComment(dataToSend, this.handleResp)
            this.setState({comments: [dataToSend, ...this.state.comments]});
        }else{
            this.setState({errMsg:'You should Login first'})
        }
    }
    changeClickState=()=>{
        this.setState({userWantToComment:!this.state.userWantToComment});
    }
    postPhases=()=>{
        this.setState({published:!this.state.published})
            changePostPhase(this.state.post,)
                .catch(()=>{
                    console.log("somethig wrong with publish/un-publish")
                });


    }
    handleLike=()=>{
        this.setState({liked:!this.state.liked})
    }
    render(){
        if (this.state.post) {
            return (
                <div className="SinglePost">
                    <div className="post">

                        <div className="postBody">
                            <img src={this.state.post.img} className="postPic" alt="user Pic"/>

                            <div className="postContent">
                                <div className="postHeader">
                                    <h4 className="postAuthor" >{this.state.post.author_name}</h4>
                                    <span className="publishDate">{this.state.post.published_at}</span>
                                </div>
                                <div className="postTitle"><h2>{this.state.post.title}</h2></div>
                                <div className="postText">{this.state.post.content}</div>

                                <div className="postDesc">
                                    <span className="desc">
                                        {this.state.liked ?
                                            <button className="fa fa-heart" aria-hidden="true" title="Like" style={{color: "red",fontSize:"25px"}} onClick={this.handleLike}></button>
                                            : <button className="fa fa-heart-o" aria-hidden="true" title="Like" style={{color: "#00000030",fontSize:"25px"}} onClick={this.handleLike}></button>}
                                       {/*<button className="fa fa-heart" aria-hidden="true" title="Like" ></button>*/}
                                        </span>

                                    {this.state.post.author_id == this.props.user.id
                                    ?
                                    <div className="authorB">
                                        <span className="desc">
                                        <Link to={`/post/${this.state.post.id}/edit`}><button className="fa fa-pencil-square-o" style={{fontSize:"25px"}} aria-hidden="true" title="Edit Post"></button><br/></Link>
                                        </span>
                                        <span className="desc">
                                        <button  className="fa fa-trash-o" style={{fontSize:"25px"}} onClick={this.handleDelete} title="Delete Post"></button><br/>
                                        </span>
                                        <span className="desc">
                                            {this.state.published ?
                                                <div>
                                                <input type="checkbox" className="toggle" checked onClick={this.postPhases}/>
                                                    <p style={{color:"lime"}}>Published</p>
                                                </div>
                                                :
                                                <div>
                                                <input type="checkbox" className="toggle" onClick={this.postPhases}/>
                                                <p style={{color:"black" }}>Unpublished</p>
                                                </div>
                                                }
                                        </span>
                                        </div>
                                    : null
                                }
                                </div>
                                </div>
                                </div>

                                <div className="input_comment">
                                    <textarea type="text" className="commentInput" placeholder="Join the conversation.." onChange={this.handleComment}/>
                                    <button className="save_comment" onClick={this.handleSubmitComment}>save comment</button>
                                    <p className="err"style={{color:"red"}}>{this.state.errMsg}</p>
                                </div>

                </div>

                    <section className="comments-section">
                            <br/>
                            <h5>Comments:</h5>
                                    <div className="comments">
                                        {this.state.comments ? makeComments(this.state.comments):<div>There is no comments yet</div>}
                                </div>
                        </section>

                </div>);
        }
        else{
            return(
                <div>
                    loading Post...
                </div>);
        }
    }
}

export default SinglePostPage;