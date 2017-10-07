import * as React from 'react'
import glamorous from 'glamorous'
import { keyframes } from 'glamor'
import { checkPackage, PackageAvailable } from './checkPackage'
import {
  Card,
  CardHeader,
  Input,
  Button,
  colors,
  List,
  ListItem,
} from 'material-ui'

let bounce = keyframes({
  '0%': {
    transform: 'scale(1)',
  },
  '50%': {
    transform: 'scale(1.05)',
  },
  '100%': {
    transform: 'scale(1)',
  },
})
const mediaQueries = {
  phone: '@media only screen and (max-width: 500px)',
}
const WideCard = glamorous(Card)<{ double?: boolean }>(
  {
    width: '600px',
    padding: '0 20px 10px',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    marginBottom: '80px',
    [mediaQueries.phone]: {
      width: 'calc(100% - 40px)',
      marginBottom: '20px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  ({ double }) => ({
    animation: double ? `${bounce} 0.3s infinite ease` : '',
  })
)

const Wrapper = glamorous.div({
  display: 'flex',
  marginTop: '40px',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  [mediaQueries.phone]: {
    marginTop: '20px',
  },
})

type State = {
  packageName: string
  avaliable: boolean
  avaliableJS: boolean
  requestDone: boolean
  history: { packageName: string; available: boolean }[]
  loading: boolean
}

const NpmListItem = glamorous(ListItem)({
  display: 'flex',
})

const Link = glamorous.a<{ available: boolean }>(
  {
    textDecoration: 'none',
    color: 'black',
    marginBottom: '8px',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    padding: '8px',

    ':visited': {
      color: 'black',
    },
  },
  ({ available }) => ({
    backgroundColor: available ? colors.green['500'] : colors.red['500'],
    ':hover': {
      backgroundColor: available ? colors.green.A400 : colors.red.A400,
    },
  })
)

const jsEndingRegex = /(.*?)js$/

class App extends React.Component<{}, State> {
  state: State = {
    packageName: '',
    avaliable: false,
    avaliableJS: false,
    requestDone: false,
    history: [],
    loading: false,
  }

  onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ packageName: e.currentTarget.value.toLowerCase() })
  }

  onCheckName = async () => {
    const { packageName, history } = this.state

    this.setState({ loading: true })
    let result: PackageAvailable, resultWithJS: PackageAvailable
    let name: string, nameJS: string
    if (jsEndingRegex.test(packageName)) {
      nameJS = packageName
      name = packageName.substr(0, packageName.length - 2)
    } else {
      nameJS = packageName + 'js'
      name = packageName
    }

    resultWithJS = await checkPackage(nameJS)
    result = await checkPackage(name)

    this.setState({
      loading: false,
      requestDone: true,
      avaliable: result.packageAvailable,
      avaliableJS: resultWithJS.packageAvailable,
      history: [
        {
          packageName: name,
          available: result.packageAvailable,
        },
        {
          packageName: nameJS,
          available: resultWithJS.packageAvailable,
        },
        ...history,
      ],
    })
  }

  next = () => {
    this.setState({
      loading: false,
      packageName: '',
      avaliable: false,
      avaliableJS: false,
      requestDone: false,
    })
  }

  submitOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.keyCode === 13) {
      this.onCheckName()
    }
  }

  render() {
    const {
      loading,
      packageName,
      requestDone,
      avaliable,
      avaliableJS,
      history,
    } = this.state

    return (
      <Wrapper>
        <WideCard
          style={{
            backgroundColor: avaliable || avaliableJS ? colors.green.A400 : '',
          }}
          double={avaliable && avaliableJS}
        >
          <CardHeader title="Drink JS" />
          <Input
            placeholder="pick a name"
            onChange={this.onNameChange}
            disabled={loading || requestDone}
            onKeyPress={this.submitOnEnter}
            value={packageName}
          />
          <Button onClick={this.onCheckName} disabled={loading || requestDone}>
            Check
          </Button>
          <Button onClick={this.next} disabled={!requestDone}>
            retry
          </Button>
        </WideCard>
        {history.length > 0 ? (
          <WideCard>
            <List>
              {history.map(({ available, packageName }, i) => {
                return (
                  <NpmListItem key={packageName + i}>
                    <Link
                      href={`https://npm.im/${packageName}`}
                      target={'_blank'}
                      available={available}
                    >
                      {packageName}
                    </Link>
                  </NpmListItem>
                )
              })}
            </List>
          </WideCard>
        ) : null}
      </Wrapper>
    )
  }
}

export default App
