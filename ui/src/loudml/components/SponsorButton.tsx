import React, {Component} from 'react'

class SponsorButton extends React.Component {
    render() {
        return <a className="btn btn-sm btn-primary btn-sm" target="_blank" aria-label="Sponsor Loud ML" href="//github.com/sponsors/regel">
            <span className="icon">
            <svg className="octicon octicon-heart icon-sponsor"
                viewBox="0 0 12 16"
                version="1.1" width="12" height="16" aria-hidden="true">
                <path fillRule="evenodd"
                    d="M9 2c-.97 0-1.69.42-2.2 1-.51.58-.78.92-.8 1-.02-.08-.28-.42-.8-1-.52-.58-1.17-1-2.2-1-1.632.086-2.954 1.333-3 3 0 .52.09 1.52.67 2.67C1.25 8.82 3.01 10.61 6 13c2.98-2.39 4.77-4.17 5.34-5.33C11.91 6.51 12 5.5 12 5c-.047-1.69-1.342-2.913-3-3z">
                </path>
            </svg>
            </span>
            Sponsor
            </a> ;
    }
}

export default SponsorButton