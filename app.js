class Aluno {

	constructor(nome, disciplina, nota1, nota2){
		this.nome = nome
		this.disciplina = disciplina
		this.nota1 = nota1
		this.nota2 = nota2
		this.media
		this.situacao
	}

	calcularMedia(){
		this.media = parseFloat(this.nota1) + parseFloat(this.nota2)

		if(this.media >= 7){
			this.situacao = 'aprovado'
		} else {
			this.situacao = 'reprovado'
		}

	}

	validarDados(){

		if(this.nota1 > 5 || this.nota2 > 5){
			return false
		}

		for(let i in this){
			if(this[i] === null || this[i] === '' || this[i] === ""){
				console.log('Dados inválidos')
				return false
			}
		}

		console.log('Dados válidos')

		return true
	}
}

class AlunoFiltro {

	constructor(nome, media, disciplina, situacao){
		this.nome = nome
		this.media = media
		this.disciplina = disciplina
		this.situacao = situacao
	}

}

class AlunoEditado extends Aluno {
	constructor(id, nome, disciplina, nota1, nota2){
		super(nome, disciplina, nota1, nota2)
		this.id = id
	}
}


class Bd {

	constructor(){
		let id = localStorage.getItem('id') //null

		if(id === null){
			localStorage.setItem('id', 0)
		}

	}

	proximoId(){
		let id = localStorage.getItem('id')
		return parseFloat(id) + 1
	}

	cadastrar(a){

		let id = this.proximoId()

		console.log(id)

		localStorage.setItem('id', id)

		localStorage.setItem(id, JSON.stringify(a))
	}

	editar(a){

		let id = a.id

		console.log(id)

		localStorage.setItem(id, JSON.stringify(a))
	}

	listarAlunos(){

		//array de alunos
		let alunos = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as alunos cadastradas no localStorage
		for(let i = 1; i <= id; i++){

			let aluno = JSON.parse(localStorage.getItem(i)) 

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos a aplicação vai pular estes índices
			if(aluno == null){
				continue
			}

			aluno.id = i
			alunos.push(aluno)
		}

		return alunos

	}

	pesquisar(aluno){

		let alunosFiltrados = this.listarAlunos()

		//nome
		if(aluno.nome != ''){
			console.log('Filtro de nome')
			alunosFiltrados = alunosFiltrados.filter(a => a.nome == aluno.nome)
		}

		//disciplina
		if(aluno.disciplina != ''){
			console.log('Filtro de disciplina')
			alunosFiltrados = alunosFiltrados.filter(a => a.disciplina == aluno.disciplina)
		}

		//media
		if(aluno.media != ''){
			console.log('Filtro de média')
			alunosFiltrados = alunosFiltrados.filter(a => a.media == aluno.media)
		}

		//situacao
		if(aluno.situacao != ''){
			console.log('Filtro de situação')
			alunosFiltrados = alunosFiltrados.filter(a => a.situacao == aluno.situacao)
		}

		//console.log(alunosFiltrados)
		return alunosFiltrados

	}

	remover(id){
		localStorage.removeItem(id)
	}

}

let bd = new Bd()

function cadastrarAluno(){

	let nome = document.getElementById('nome')
	let disciplina = document.getElementById('disciplina')
	let nota1 = document.getElementById('nota1')
	let nota2 = document.getElementById('nota2')

	let aluno = new Aluno(nome.value, disciplina.value, nota1.value, nota2.value)
	aluno.calcularMedia()

	if(aluno.validarDados()){

		let modalTitulo = document.getElementById('modalTitle')
		modalTitulo.className = `modal-title text-success`
		modalTitulo.innerHTML = 'Cadastro realizado com sucesso!'

		let modaBody = document.getElementById('modalBody')
		modalBody.className = `modal-body`
		modalBody.innerHTML = 'Aluno cadastrado no sistema.'

		let button = document.getElementById('btn')
		button.className = `btn btn-success`
		button.innerHTML = 'Voltar'

		$('#ModalCadastroAluno').modal('show')

		//cadastra o aluno no localStorage
		bd.cadastrar(aluno)

		//limpa os campos de texto
		nome.value = ''
		disciplina.value = ''
		nota1.value = ''
		nota2.value = ''


	} else {
		let modalTitulo = document.getElementById('modalTitle')
		modalTitulo.className = `modal-title text-danger`
		modalTitulo.innerHTML = 'Não foi possível cadastrar!'

		let modaBody = document.getElementById('modalBody')
		modalBody.className = `modal-body`
		modalBody.innerHTML = 'Ops! Algum dado não foi preenchido corretamente, volte para corrigir.'

		let button = document.getElementById('btn')
		button.className = `btn btn-danger`
		button.innerHTML = 'Voltar e corrigir'

		$('#ModalCadastroAluno').modal('show')
	}

}

function carregarListaAlunos( alunos = Array(), filtro = false){

	if(alunos.length == 0 && filtro == false){
		despesas = bd.listarAlunos()
	}
	
	//selecionando o elemento tbody
	let tbody = document.getElementById('listaAlunos')
	tbody.innerHTML = ''

	alunos.forEach(function(a){

		//criando a linha (tr)
		let linha = tbody.insertRow()

		//criando as colunas (td)

		//coluna0
		linha.insertCell(0).innerHTML = a.id

		//coluna1
		linha.insertCell(1).innerHTML = a.nome

		//coluna2
		linha.insertCell(2).innerHTML = a.disciplina

		let coluna3 = linha.insertCell(3)
		coluna3.innerHTML = a.nota1
		coluna3.style.textAlign = 'center'

		let coluna4 = linha.insertCell(4)
		coluna4.innerHTML = a.nota2
		coluna4.style.textAlign = 'center'

		let coluna5 = linha.insertCell(5)
		coluna5.innerHTML = a.media
		coluna5.style.textAlign = 'center'

		let coluna6 = linha.insertCell(6)
		if(a.situacao === 'reprovado'){
			coluna6.className = 'text-danger'
			coluna6.innerHTML = `<b>${a.situacao}</b>`

		} else if(a.situacao === 'aprovado'){
			coluna6.className = 'text-success'
			coluna6.innerHTML = `<b>${a.situacao}</b>`
		}
	
		let link = document.createElement('a')
		link.innerHTML = '<i class="fas fa-times"></i>'
		link.className = 'text-light'
		link.id = `id_despesa_${a.id}`
		link.onclick = function(){

			//remover o aluno
			let id = this.id.replace('id_despesa_', '')

			if(confirm('Tem certeza que deseja remover este registro?') == true){

				bd.remover(id)

				document.getElementById('AlertaRemocaoAluno').style.display = 'block'

				setInterval(function(){
					window.location.reload()
				}, 2000)

			}
			
		}

		//coluna7
		linha.insertCell(7).appendChild(link)

		let link2 = document.createElement('a')
		link2.className = 'text-light'
		link2.innerHTML = '<i class="fas fa-user-edit"></i>'
		link2.onclick = function(){

			document.getElementById('id').value = a.id
			document.getElementById('nome').value = a.nome
			document.getElementById('disciplina').value = a.disciplina
			document.getElementById('nota1').value = a.nota1
			document.getElementById('nota2').value = a.nota2

			$('#ModalEditarAluno').modal('show')
		}

		let btn2 = document.getElementById('btn2')

		btn2.onclick = function(){			

			let id = document.getElementById('id').value
			let nome = document.getElementById('nome').value
			let disciplina = document.getElementById('disciplina').value
			let nota1 = document.getElementById('nota1').value
			let nota2 = document.getElementById('nota2').value

			let aluno = new AlunoEditado(id, nome, disciplina, nota1, nota2)
			aluno.calcularMedia()

			bd.editar(aluno)

			$('#ModalEditarAluno').modal('hide')

			window.location.reload()
		}


		//coluna8
		linha.insertCell(8).appendChild(link2)


	})

}

function pesquisarAlunos(){

	let nome = document.getElementById('nome-aluno').value
	let media = document.getElementById('media').value
	let disciplina = document.getElementById('disciplina-aluno').value
	let situacao = document.getElementById('situacao').value

	let aluno = new AlunoFiltro(nome, media, disciplina, situacao)

	let alunos = bd.pesquisar(aluno)

	carregarListaAlunos(alunos, true)

}

setTimeout(function(){
	exibeAviso()
}, 30000)

function exibeAviso(){
	$('#ModalAviso').modal('show')
}





