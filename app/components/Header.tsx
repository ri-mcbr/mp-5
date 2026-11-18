import styled from "styled-components";

const HeaderWrapper = styled.header`
    display: flex;
    font-size: 16px;
    justify-content: space-between;
    align-items: center;
    height: 10vh;
    background-color: white;
    color: black;
    padding: 0 6vh;
`;

export default function Header() {
    return (
        <HeaderWrapper>
            <h2>URL Shortener</h2>
        </HeaderWrapper>
    );
}