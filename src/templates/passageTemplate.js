import React from 'react'
import { graphql, Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import '../components/layout.css'

const Verse = (props) => {
  const verseData = props.verseData
  const text = verseData.verseText.split(' ')

}

class Passage extends React.Component {
  render() {
    const { data } = this.props
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{data.neo4j.Book[0].title}</title>
          <meta content="{data.neo4j.Book[0].title}" property="og:title" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Helmet>
        <div className="container">
          <h1 className="sticky-title">{data.neo4j.Book[0].title}</h1>

          {data.neo4j.Book[0].chapters.map(chapter=>(
            <>
            <h3 className="sticky-sub" id={chapter.chapterNum}>Chapter {chapter.chapterNum}</h3>
            {chapter.paragraphs.map(para => (
              <p>
                {para.verses.map(verse => (
                  <>
                  {" "}<span className="verse-num">{verse.verseNum}</span>
                  {verse.tokens.map(token => (
                    <>
                    {" "}{token.oParen == "1" && "("}
                    {
                    token.italic == "1" ? <i>{token.token}</i> :
                    token.person.length > 0 ? <Link to={'/person/' + token.person[0].slug}>{token.token}</Link> :
                    token.place.length > 0 ? <Link to={'/place/' + token.place[0].slug}>{token.token}</Link> :
                    token.token
                    }
                    {token.punc}{token.cParen == "1" && ")"}
                    </>
                  ))}
                  </>
                ))}
              </p>
            ))}
            </>
          ))}
          <div className="footer" />
        </div>
      </>
    )
  }
}

export default Passage

export const pageQuery = graphql`
query ($lookupName: String!) {
  neo4j {
    Book(orderBy: bookOrder_asc, filter: {slug: $lookupName}) {
      title
      bookOrder
      chapters(orderBy: chapterNum_asc) {
        title
        chapterNum
        paragraphs(orderBy: id_asc) {
          id
          verses(orderBy: verseNum_asc) {
            verseNum
            verseText
            osisRef
            tokens (orderBy: versePos_asc){
              token
              oParen
              cParen
              punc
              italic
              versePos
              person {
                slug
              }
              place {
                slug
              }
            }
          }
        }
      }
    }
  }
}

`