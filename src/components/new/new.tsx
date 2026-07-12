import { Box, Heading, Image, useColorModeValue, Text, Link, HStack, Badge } from '@chakra-ui/react'
import axios from 'axios'
import { forwardRef, useCallback, useEffect, useState, ForwardedRef } from 'react'
import formatTime from '../../util/timeago'
import { useInView } from 'react-intersection-observer'
import { BeatLoader } from 'react-spinners'

interface NewsInfo {
  article_id?: string
  duplicate?: boolean
  link?: string
  title?: string
  category?: string[]
  source_name?: string
  pubDate?: string
  image_url?: string
  description?: string
  [key: string]: unknown
}

interface NewCardProps {
  infor?: NewsInfo
}

const NewCard = forwardRef<HTMLDivElement, NewCardProps>(({ infor }, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <Box ref={ref} my={4} py={2} rounded="10px" bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.200')}>
      <Link isExternal href={infor?.link} _hover={{ textDecoration: 'none' }}>
        <Box as="header" px={2} pb={2}>
          <Heading textAlign="left" fontSize="20px">
            {infor?.title}
          </Heading>
          <HStack alignItems="start" mt="2">
            {infor?.category?.map((t, index) => <Badge key={index}>{t}</Badge>)}
            <Box ml="auto">
              <Text textAlign="right" color={useColorModeValue('blue.500', 'pink.400')}>
                {infor?.source_name}
              </Text>
              <Text textAlign="right" color={useColorModeValue('blackAlpha.600', 'whiteAlpha.500')}>
                {infor?.pubDate ? formatTime(infor.pubDate) : ''}
              </Text>
            </Box>
          </HStack>
        </Box>
        {infor?.image_url && (
          <Box overflow="hidden">
            <Image
              loading="lazy"
              minH="400px"
              maxH="600px"
              w="full"
              src={infor.image_url}
              alt={infor.title}
              objectFit="cover"
            />
          </Box>
        )}
        <Text noOfLines={3} pl={2} textAlign="left">
          {infor?.description}
        </Text>
      </Link>
    </Box>
  )
})

NewCard.displayName = 'NewCard'

function News() {
  const [news, setNews] = useState<NewsInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasmore] = useState(true)
  const [nextPage, setNextPage] = useState('')
  const { ref, inView } = useInView()

  const fetchNew = useCallback(async () => {
    if (loading || !hasMore) return
    try {
      setLoading(true)
      const apiNewUrl = nextPage
        ? `https://newsdata.io/api/1/latest?apikey=pub_329179b715651c913e65ae1c6a17852dc5c79&page=${nextPage}`
        : 'https://newsdata.io/api/1/latest?apikey=pub_329179b715651c913e65ae1c6a17852dc5c79&q=sport football'
      const response_api_new = await axios.get(apiNewUrl)

      if (!response_api_new?.data.results.length) {
        setHasmore(false)
        return
      }
      setNews(pre => [...pre, ...response_api_new.data.results])
      setNextPage(response_api_new.data.nextPage)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [nextPage, hasMore, loading])

  useEffect(() => {
    if (inView) {
      fetchNew()
    }
  }, [inView, fetchNew])

  return (
    <Box>
      {news?.map(newinfo => {
        if (newinfo.duplicate) return null
        return <NewCard key={newinfo.article_id} infor={newinfo} />
      })}
      <Box>
        <Box pt={2} ref={ref} display="flex" justifyContent="center">
          {loading && <BeatLoader color="white" />}
        </Box>
      </Box>
    </Box>
  )
}

export default News
