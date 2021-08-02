import { Component } from "react";
import axios from "../axios";

export default class AvatarUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filepath: null,
        };
        this.onChange = this.onChange.bind(this);
        this.uploadAvatar = this.uploadAvatar.bind(this);
    }

    onChange(event) {
        event.stopPropagation();
        console.log("event target files", event.target.files[0]);
        this.setState({
            filepath: event.target.files[0],
        });
    }

    async uploadAvatar(event) {
        event.preventDefault();
        console.log("file", this.state.filepath);
        let formData = new FormData();
        formData.append("file", this.state.filepath);
        const response = await axios.post("/api/upload", formData);
        this.props.toggleModal();
        this.props.updateAvatar(response.data);
    }

    render() {
        return (
            <div className="modal" onClick={this.props.toggleModal}>
                <div className="modalForm">
                    <form
                        action="/"
                        method="POST"
                        encType="multipart/form-data"
                        onSubmit={this.uploadAvatar}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            name="file"
                            id="file"
                            onClick={(event) => event.stopPropagation()}
                            onChange={this.onChange}
                        ></input>
                        <button type="submit">Upload</button>
                    </form>
                </div>
            </div>
        );
    }
}
