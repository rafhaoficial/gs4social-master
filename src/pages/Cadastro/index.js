import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  TouchableOpacity,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInputMask} from 'react-native-masked-text';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import apigs4 from '../../services/apigs4';
import {useTranslation} from 'react-i18next';

import {
  Container,
  TextoOpcoes,
  Borda,
  Pickers,
  MenuOpcoes,
  ViewSelect,
  Input,
  ViewInput,
  TextoBotao,
  TextoLogin,
  Botao,
  BotaoLogin,
  Helper,
  TextoMenu,
} from './style';
import HeaderCadastro from '../../components/header-cadastro';
import {Checkbox} from 'react-native-paper';

export default function Cadastro({navigation}) {
  const scroll = useRef();
  const [name, setName] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');
  const [email_confirm, setEmail_confirm] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirm, setPassword_confirm] = useState('');
  const [type, setType] = useState('doador');
  const [carregando, setCarregando] = useState(false);
  const [check, setCheck] = useState(false);
  const [visibleSenha, setVisibleSenha] = useState(false);
  const [visibleCheckSenha, setVisibleCheckSenha] = useState(false);
  const [modal, setModal] = useState(false);

  async function cadastrar() {
    if (check) {
      setCarregando(true);
      if (
        name &&
        password &&
        (phone_number || Platform.OS == `ios`) &&
        email &&
        type &&
        password_confirm &&
        email_confirm
      ) {
        if (
          email.toLowerCase().replace(/ /g, '') ==
            email_confirm.toLowerCase().replace(/ /g, '') &&
          password == password_confirm
        ) {
          await apigs4
            .post('/users', {
              email: email.toLowerCase().replace(/ /g, ''),
              password,
              name,
              phone_number,
              terms_of_use:
                'Termos atualizado dia 30 de julho de 2021 aceito pelo usuário',
            })
            .then(async (response) => {
              navigation.navigate('Login');
              Alert.alert('', 'Confirme seu email para entrar no aplicativo');
            })
            .catch((error) => {
              console.log(error);
              if (
                error.response.data.message ==
                'celebrate request validation failed'
              ) {
                if (
                  error.response.data.validation.body.message ==
                  '"email" must be a valid email'
                ) {
                  Alert.alert('', t('Email digitado é invalido'));
                }
              } else {
                Alert.alert('', error.response.data.message);
              }
            });
        } else {
          if (password != password_confirm) {
            Alert.alert('', t('As senhas informadas não coincidem'));
          } else {
            if (email != email_confirm) {
              Alert.alert('', t('Os emails informados não coincidem'));
            }
          }
        }
      } else {
        Alert.alert('', t('Preencha todos os campos corretamente!'));
      }
      setCarregando(false);
    } else {
      Alert.alert(
        '',
        t(
          'Aceite os termos e condições do aplicativo para concluir seu cadastro',
        ),
      );
    }
  }

  const {t, i18n} = useTranslation();
  return (
    <ScrollView ref={scroll} style={{backgroundColor: '#f0f0f0'}}>
      <HeaderCadastro />
      <Container>
        <TextoMenu>{t('Preencha todos os campos corretamente!')}</TextoMenu>

        <ViewSelect>
          <MenuOpcoes
            onPress={() => {
              setType('doador');
            }}>
            <TextoOpcoes
              style={{color: type == 'doador' ? '#7ac5ce' : '#606060'}}>
              {t('Doador')}
            </TextoOpcoes>
            <Borda
              style={{
                backgroundColor: type == 'doador' ? '#7ac5ce' : '#C4C4C4',
              }}></Borda>
          </MenuOpcoes>
          <MenuOpcoes
            onPress={() => {
              setType(null);
            }}>
            <TextoOpcoes
              style={{color: type != 'doador' ? '#7ac5ce' : '#606060'}}>
              {t('Instituição')}
            </TextoOpcoes>
            <Borda
              style={{
                backgroundColor: type != 'doador' ? '#7ac5ce' : '#C4C4C4',
              }}></Borda>
          </MenuOpcoes>
        </ViewSelect>
        {type == 'doador' ? (
          <>
            <ViewInput>
              <Icon
                name="person"
                style={{marginLeft: 8, marginRight: 8}}
                size={25}
                color={'#5f5f5f'}
              />
              <Input
                placeholderTextColor="#888"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                }}
                placeholder={`${t('Nome')}*`}></Input>
            </ViewInput>
            <ViewInput>
              <Icon
                name="email"
                style={{marginLeft: 8, marginRight: 8}}
                size={25}
                color={'#5f5f5f'}
              />
              <Input
                placeholderTextColor="#888"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                }}
                placeholder={`${t('Email')}*`}></Input>
            </ViewInput>
            <ViewInput>
              <Icon
                name="email"
                style={{marginLeft: 8, marginRight: 8}}
                size={25}
                color={'#5f5f5f'}
              />
              <Input
                placeholderTextColor="#888"
                autoCapitalize="none"
                value={email_confirm}
                onChangeText={(text) => {
                  setEmail_confirm(text);
                }}
                placeholder={`${t('Confirme o Email')}*`}></Input>
            </ViewInput>
            <ViewInput>
              <Icon
                name="lock"
                style={{marginLeft: 8, marginRight: 8}}
                size={25}
                color={'#5f5f5f'}
              />
              <Input
                placeholderTextColor="#888"
                style={{flex: 1}}
                secureTextEntry={!visibleSenha}
                autoCapitalize="none"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                }}
                placeholder={`${t('Senha')}*`}></Input>
              <TouchableOpacity
                onPress={() => {
                  let visible = !visibleSenha;
                  setVisibleSenha(visible);
                }}>
                <Icon
                  name={!visibleSenha ? 'visibility' : 'visibility-off'}
                  style={{marginLeft: 8, marginRight: 8}}
                  size={25}
                  color={'#5f5f5f'}
                />
              </TouchableOpacity>
            </ViewInput>
            <ViewInput>
              <Icon
                name="lock"
                style={{marginLeft: 8, marginRight: 8}}
                size={25}
                color={'#5f5f5f'}
              />
              <Input
                placeholderTextColor="#888"
                style={{flex: 1}}
                secureTextEntry={!visibleCheckSenha}
                autoCapitalize="none"
                value={password_confirm}
                onChangeText={(text) => {
                  setPassword_confirm(text);
                }}
                placeholder={`${t('Confirme a Senha')}*`}></Input>
              <TouchableOpacity
                onPress={() => {
                  let visible = !visibleCheckSenha;
                  setVisibleCheckSenha(visible);
                }}>
                <Icon
                  name={!visibleCheckSenha ? 'visibility' : 'visibility-off'}
                  style={{marginLeft: 8, marginRight: 8}}
                  size={25}
                  color={'#5f5f5f'}
                />
              </TouchableOpacity>
            </ViewInput>
            <ViewInput>
              <Icon
                name="call"
                style={{marginLeft: 8, marginRight: 8}}
                size={25}
                color={'#5f5f5f'}
              />
              <TextInputMask
                type={'cel-phone'}
                options={{
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(99) ',
                }}
                style={{flex: 1}}
                value={phone_number}
                onChangeText={(text) => {
                  setPhone_number(text);
                }}
                onFocus={() => {
                  scroll.current.scrollToEnd({
                    animated: true,
                  });
                }}
                placeholder={`${t('WhatsApp')}`}
                placeholderTextColor="#888"
              />
            </ViewInput>
            <ViewInput
              style={{
                backgroundColor: 'transparent',
                height: 50,
                justifyContent: 'center',
                marginBottom: 10,
              }}>
              <View style={{backgroundColor: '#FFF', borderRadius: 5}}>
                <Checkbox
                  onPress={() => {
                    let cartao = check;
                    setCheck(!cartao);
                  }}
                  status={check ? 'checked' : 'unchecked'}
                  color="#000"
                  uncheckedColor="#000"></Checkbox>
              </View>

              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  width: '90%',
                  marginLeft: 10,
                }}>
                {t('ACEITO OS')}{' '}
                <Text
                  onPress={() => {
                    setModal(true);
                  }}
                  style={{textDecorationLine: 'underline'}}>
                  {t('TERMOS DE SERVIÇO E PRIVACIDADE')}
                </Text>
              </Text>
            </ViewInput>
            <BotaoLogin
              disabled={carregando}
              onPress={() => {
                cadastrar();
              }}>
              {carregando ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <TextoLogin>{t('Cadastre-se')}</TextoLogin>
              )}
            </BotaoLogin>
          </>
        ) : (
          <>
            <TextoLogin
              style={{
                marginTop: 15,
                marginBottom: 25,
                fontSize: 15,
                color: '#000',
              }}>
              {t('Seja uma Instituição no GS4 Social')}
            </TextoLogin>

            <BotaoLogin
              onPress={() => {
                Linking.openURL('https://www.gs4social.com/pre-cadastro/');
              }}>
              <TextoLogin>{t('Fazer Pré-Cadastro')}</TextoLogin>
            </BotaoLogin>
          </>
        )}
      </Container>

      <Modal
        backdropOpacity={0.8}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
        }}
        onBackdropPress={() => {
          setModal(false);
        }}
        isVisible={modal}>
        <View
          style={{
            margin: 0,
            width: '85%',
            height: 400,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            borderRadius: 10,
          }}>
          <ScrollView style={{flex: 1, width: '100%'}}>
            <Text style={{textAlign: 'left', width: '90%'}}>
              TERMOS E CONDIÇÕES DE USO DO SITE E APLICATIVO GS4 SOCIAL{'\n\n'}
              Última atualização: 30 de julho de 2021{'\n\n'}A participação no
              site e aplicativo GS4 Social depende da sua plena concordância com
              os termos e condições de uso abaixo transcritos:
              {'\n\n'}O GS4 Social inscrito no CNPJ sob número 41.595.108/0001-5
              com sede na Rua Eugênio de Lima, 143, sala 01, Boa Viagem, Recife,
              PE, CEP: 51.030-360, único e exclusivo proprietário da marca,
              domínio www.gs4social.com e aplicativo mobile GS4 Social,
              estabelece o presente instrumento, denominado TERMO DE USO para o
              USUÁRIO, conforme as condições abaixo descritas:
              {'\n\n'}1. ACEITAÇÃO DO TERMO DE USO PELO USUÁRIO
              {'\n\n'}1.1 Ao usar o APP, website ou serviço de qualquer forma,
              incluindo, mas não se limitando a visitar ou navegar no APP,
              website e/ou publicar ou colaborar com projetos, você concorda com
              estes Termos de Uso, que incluem a Política de Privacidade
              disponibilizada no portal, bem como com as regras operacionais e
              procedimentos que possam ser publicados no website e aplicativo de
              tempos em tempos.
              {'\n'}1.2 O GS4 Social poderá alterar estes termos de uso a
              qualquer tempo, e o Usuário concorda em cumpri-los, mediante
              prévia anuência do Usuário.
              {'\n\n'}2. PROPÓSITO DO GS4 Social{'\n\n'}O objetivo do GS4
              Social, por meio de seu APP, website, redes sociais e outros meios
              de comunicação-informação, consiste em disponibilizar aos usuários
              doadores as instituições filantrópicas e órgãos públicos de
              assistência social, à saúde e educação mais próxima do usuário.
              {'\n'}A localização da instituição filantrópica ou órgão público é
              realizada por sistema de geolocalização-GPS e os usuários tem,
              além da localização no mapa, lista das instituições no menu ao
              lado do mapa, de fácil visualização, com as informações
              necessárias para contatar e ajudar as instituições e órgãos
              públicos.
              {'\n'}O GS4 Social promove a conexão entre as instituições
              filantrópicas e os órgãos públicos com os doadores e os
              beneficiários dos serviços destes.
              {'\n'}As instituições filantrópicas e os órgãos públicos
              disponibilizam sua localização, números de telefone, e-mail e
              endereço atualizado, bem como, as campanhas, projetos, serviços
              prestados, objeto dos serviços e várias outras informações
              necessárias de interesse dos usuários doadores.
              {'\n'}Entender como instituições filantrópicas as pessoas
              jurídicas que prestam serviços de filantropia, como exemplo, as
              ONGs, as associações, as Fundações e as igrejas. Não se faz
              necessário ter título do Governo como entidade filantrópica para
              se cadastrar no aplicativo e site.
              {'\n\n'}3. REQUISITOS PARA CADASTRAMENTO DO USUÁRIO DOADOR NO
              APLICATIVO E DO SITE DO GS4 Social:
              {'\n\n'}3.1 O usuário doador que deseja se cadastrar no APP e site
              do GS4 Social precisam preencher o formulário no site ou
              aplicativo e aceitar as condições de uso.
              {'\n'}3.2 O usuário doador tem acesso gratuito ao aplicativo e
              site, sem precisar se cadastrar, e inclusive realizar doações
              diretamente as instituições filantrópica cadastradas, porém se
              desejar que o GS4 Social intermediei doação do usuário doador, bem
              como, este receba informativo atualizados das instituições
              filantrópicas, e outros serviços adicionais, será necessário se
              cadastrar no site ou aplicativo, informando nome completo, e-mail
              e fone;
              {'\n'}3.3 O usuário doador fica ciente que os bens ou recursos
              financeiros doados devem ser de origem lícita;
              {'\n'}3.4 O usuário doador cadastrado fica ciente que as
              instituições filantrópicas cadastradas no GS4 social não pode
              estar envolvidas em processos criminais, dívidas fiscais,
              trabalhistas ou cíveis. Todavia, se existirem processos de
              dívidas, judiciais ou administrativos, de pequeno valor, e com
              defesa bem fundamentada, o jurídico do GS4 Social poderá validar o
              cadastro, após entrega destes documentos.
              {'\n'}3.5 O usuário doador deve fornecer ao GS4 Social informações
              verídicas, atualizadas e atuar com transparência e boa-fé, se
              responsabilizando civil e criminalmente por informações falsas.
              {'\n'}3.6 O usuário doador fica ciente que o GS4 Social
              disponibiliza as informações e/ou uso no site, no aplicativo
              mobile e redes sociais de forma gratuita. Porém, se a instituição
              filantrópica desejar que o GS4 Social venha intermediar doação de
              cunho financeiro, tem um pacto de taxa de 4,5% sobre os valores
              recebidos pelo GS4 Social para repasse para a instituição
              filantrópica escolhida pelo doador. As demais doações de cunho não
              financeiro, como por exemplo, cesta de alimento básico,
              vestuários, medicamento e bens em gerais, será diretamente entre
              os doadores e as instituições filantrópicas.
              {'\n'}3.7. O GS4 Social reserva-se no direito de alterar a
              política de intermediação de doações de cunho financeiro, ficando
              os usuários desta modalidade cientes da atualização pelo próprio
              sistema, podendo concordar ou declinar do uso dos sistemas.
              {'\n'}3.8 O usuário doador fica ciente que o GS4 social poderá
              disponibilizar avaliação das instituições filantrópicas de forma
              escrita, porém o doador fica ciente que deverá se responsabilizar
              por informações falsa e de cunho ofensivo, podendo ser excluído em
              definitivo do site e aplicativos.
              {'\n\n'}4. PRAZOS
              {'\n\n'}Este termo tem prazo indeterminado e pode ser rescindido a
              qualquer tempo, por qualquer uma das partes, bastando que uma das
              partes informe à outra por e-mail ou meio escrito que comprove
              efetiva notificação da outra parte.
              {'\n\n'}5. CONDIÇÕES GERAIS
              {'\n\n'}O GS4 Social não é responsável pelo conteúdo fornecido
              e/ou divulgado pela entidade cadastrada e/ou pelos usuários do
              portal, sendo que as entidades são as únicas responsáveis em caso
              de eventual ofensa a direitos de terceiros (sejam eles direitos de
              propriedade intelectual, direitos da personalidade e/ou direitos
              em virtude de contrário prévio), isentando o GS4 Social de
              qualquer responsabilidade, obrigação, ônus, custos, despesas ou
              indenizações oriundas de tal violação.
              {'\n'}O GS4 Social é apartidário, sendo vetado a publicação de
              conteúdo relacionado a qualquer partido político, inclusive pelos
              usuários-cadastrados, ou qualquer conteúdo ilegal.
              {'\n'}Em decorrência de questões técnicas e operacionais, o portal
              do GS4 Social está sujeito a eventuais problemas de interrupção,
              falha técnica, e/ou de indisponibilidade de funcionamento
              temporário. O GS4 Social se exime de qualquer responsabilidade
              pelos danos e prejuízos de toda natureza que possam decorrer da
              falta de disponibilidade ou de continuidade do funcionamento do
              portal. Igualmente, o GS4 Social não se responsabiliza por danos
              ao equipamento ou conexão do usuário em decorrência do acesso,
              utilização ou navegação no site ou aplicativo, bem como a
              transferência de imagens, textos, áudios ou vídeos contidos no
              mesmo.
              {'\n'}Fica eleito o foro da comarca de Recife-PE como competente
              para dirimir quaisquer dúvidas oriundas do presente Termo, com
              exclusão de qualquer outro, por mais privilegiado que seja.
              {'\n'}Dúvidas e sugestões podem ser enviadas ao e-mail
              contato@gs4social.com ou Fone/whatsapp (81) 98197-8750.
              {'\n\n'}
              POLÍTICA PRIVACIDADE
              {'\n\n'}A sua privacidade é importante para nós. É política do
              respeitar a sua privacidade em relação a qualquer informação sua
              que possamos coletar no site, e outros sites que possuímos e
              operamos.
              {'\n\n'}Solicitamos informações pessoais apenas quando realmente
              precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios
              justos e legais, com o seu conhecimento e consentimento. Também
              informamos por que estamos coletando e como será usado.
              {'\n\n'}Apenas retemos as informações coletadas pelo tempo
              necessário para fornecer o serviço solicitado. Quando armazenamos
              dados, protegemos dentro de meios comercialmente aceitáveis para
              evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou
              modificação não autorizados.
              {'\n\n'}
              Não compartilhamos informações de identificação pessoal
              publicamente ou com terceiros, exceto quando exigido por lei.
              {'\n\n'}O nosso site pode ter links para sites externos que não
              são operados por nós. Esteja ciente de que não temos controle
              sobre o conteúdo e práticas desses sites e não podemos aceitar
              responsabilidade por suas respectivas políticas de privacidade.
              {'\n\n'}
              Você é livre para recusar a nossa solicitação de informações
              pessoais, entendendo que talvez não possamos fornecer alguns dos
              serviços desejados.
              {'\n\n'}O uso continuado de nosso site será considerado como
              aceitação de nossas práticas em torno de privacidade e informações
              pessoais. Se você tiver alguma dúvida sobre como lidamos com dados
              do usuário e informações pessoais, entre em contacto connosco.
              {'\n\n'}Política de Cookies
              {'\n'}O que são cookies?
              {'\n\n'}
              Como é prática comum em quase todos os sites profissionais, este
              site usa cookies, que são pequenos arquivos baixados no seu
              computador, para melhorar sua experiência. Esta página descreve
              quais informações eles coletam, como as usamos e por que às vezes
              precisamos armazenar esses cookies. Também compartilharemos como
              você pode impedir que esses cookies sejam armazenados, no entanto,
              isso pode fazer o downgrade ou 'quebrar' certos elementos da
              funcionalidade do site.
              {'\n\n'}Como usamos os cookies?
              {'\n\n'}
              Utilizamos cookies por vários motivos, detalhados abaixo.
              Infelizmente, na maioria dos casos, não existem opções padrão do
              setor para desativar os cookies sem desativar completamente a
              funcionalidade e os recursos que eles adicionam a este site. É
              recomendável que você deixe todos os cookies se não tiver certeza
              se precisa ou não deles, caso sejam usados para fornecer um
              serviço que você usa.
              {'\n\n'}Desativar cookies
              {'\n\n'}
              Você pode impedir a configuração de cookies ajustando as
              configurações do seu navegador (consulte a Ajuda do navegador para
              saber como fazer isso). Esteja ciente de que a desativação de
              cookies afetará a funcionalidade deste e de muitos outros sites
              que você visita. A desativação de cookies geralmente resultará na
              desativação de determinadas funcionalidades e recursos deste site.
              Portanto, é recomendável que você não desative os cookies.
              {'\n\n'}Cookies que definimos
              {'\n'}
              {'\n    '}• Cookies relacionados à conta
              {'\n    '}• Se você criar uma conta connosco, usaremos cookies
              para o gerenciamento do processo de inscrição e administração
              geral. Esses cookies geralmente serão excluídos quando você sair
              do sistema, porém, em alguns casos, eles poderão permanecer
              posteriormente para lembrar as preferências do seu site ao sair.
              {'\n    '}• Cookies relacionados ao login
              {'\n    '}• Utilizamos cookies quando você está logado, para que
              possamos lembrar dessa ação. Isso evita que você precise fazer
              login sempre que visitar uma nova página. Esses cookies são
              normalmente removidos ou limpos quando você efetua logout para
              garantir que você possa acessar apenas a recursos e áreas
              restritas ao efetuar login.
              {'\n    '}• Cookies relacionados a boletins por e-mail
              {'\n    '}• Este site oferece serviços de assinatura de boletim
              informativo ou e-mail e os cookies podem ser usados para lembrar
              se você já está registrado e se deve mostrar determinadas
              notificações válidas apenas para usuários inscritos / não
              inscritos.
              {'\n    '}• Pedidos processando cookies relacionados
              {'\n    '}• Este site oferece facilidades de comércio eletrônico
              ou pagamento e alguns cookies são essenciais para garantir que seu
              pedido seja lembrado entre as páginas, para que possamos
              processá-lo adequadamente.
              {'\n    '}• Cookies relacionados a pesquisas
              {'\n    '}Periodicamente, oferecemos pesquisas e questionários
              para fornecer informações interessantes, ferramentas úteis ou para
              entender nossa base de usuários com mais precisão. Essas pesquisas
              podem usar cookies para lembrar quem já participou numa pesquisa
              ou para fornecer resultados precisos após a alteração das páginas.
              {'\n    '}• Cookies relacionados a formulários
              {'\n    '}Quando você envia dados por meio de um formulário como
              os encontrados nas páginas de contacto ou nos formulários de
              comentários, os cookies podem ser configurados para lembrar os
              detalhes do usuário para correspondência futura.
              {'\n    '}• Cookies de preferências do site
              {'\n    '}•Para proporcionar uma ótima experiência neste site,
              fornecemos a funcionalidade para definir suas preferências de como
              esse site é executado quando você o usa. Para lembrar suas
              preferências, precisamos definir cookies para que essas
              informações possam ser chamadas sempre que você interagir com uma
              página for afetada por suas preferências.
              {'\n\n'}Cookies de Terceiros{'\n\n'}
              Em alguns casos especiais, também usamos cookies fornecidos por
              terceiros confiáveis. A seção a seguir detalha quais cookies de
              terceiros você pode encontrar através deste site.
              {'\n\n    '}• Este site usa o Google Analytics, que é uma das
              soluções de análise mais difundidas e confiáveis da Web, para nos
              ajudar a entender como você usa o site e como podemos melhorar sua
              experiência. Esses cookies podem rastrear itens como quanto tempo
              você gasta no site e as páginas visitadas, para que possamos
              continuar produzindo conteúdo atraente.
              {'\n\n'}Para mais informações sobre cookies do Google Analytics,
              consulte a página oficial do Google Analytics.
              {'\n\n    '}• As análises de terceiros são usadas para rastrear e
              medir o uso deste site, para que possamos continuar produzindo
              conteúdo atrativo. Esses cookies podem rastrear itens como o tempo
              que você passa no site ou as páginas visitadas, o que nos ajuda a
              entender como podemos melhorar o site para você.
              {'\n    '}• Periodicamente, testamos novos recursos e fazemos
              alterações subtis na maneira como o site se apresenta. Quando
              ainda estamos testando novos recursos, esses cookies podem ser
              usados para garantir que você receba uma experiência consistente
              enquanto estiver no site, enquanto entendemos quais otimizações os
              nossos usuários mais apreciam.
              {'\n    '}• À medida que vendemos produtos, é importante
              entendermos as estatísticas sobre quantos visitantes de nosso site
              realmente compram e, portanto, esse é o tipo de dados que esses
              cookies rastrearão. Isso é importante para você, pois significa
              que podemos fazer previsões de negócios com precisão que nos
              permitem analizar nossos custos de publicidade e produtos para
              garantir o melhor preço possível.
              {'\n\n'}Compromisso do Usuário
              {'\n\n    '}O usuário se compromete a fazer uso adequado dos
              conteúdos e da informação que o oferece no site e com caráter
              enunciativo, mas não limitativo:
              {'\n    '}• A) Não se envolver em atividades que sejam ilegais ou
              contrárias à boa fé a à ordem pública{'\n    '}• B) Não difundir
              propaganda ou conteúdo de natureza racista, xenofóbica, ou apostas
              online (ex.: Betano), jogos de sorte e azar, qualquer tipo de
              pornografia ilegal, de apologia ao terrorismo ou contra os
              direitos humanos;{'\n    '}• C) Não causar danos aos sistemas
              físicos (hardwares) e lógicos (softwares) do , de seus
              fornecedores ou terceiros, para introduzir ou disseminar vírus
              informáticos ou quaisquer outros sistemas de hardware ou software
              que sejam capazes de causar danos anteriormente mencionados.
              {'\n\n'}Mais informações{'\n\n'}
              Esperemos que esteja esclarecido e, como mencionado anteriormente,
              se houver algo que você não tem certeza se precisa ou não,
              geralmente é mais seguro deixar os cookies ativados, caso interaja
              com um dos recursos que você usa em nosso site. Esta política é
              efetiva a partir de julho/2021.
            </Text>
            <BotaoLogin
              style={{width: '92%'}}
              onPress={() => {
                setCheck(true);
                setModal(false);
              }}>
              <Text style={{color: '#FFF', fontWeight: 'bold'}}>
                {t('Aceito os Termos de Serviço e Privacidade')}
              </Text>
            </BotaoLogin>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}
