
        // Navegação e funcionalidades do menu
        document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.getElementById('menuToggle');
            const navMenu = document.getElementById('navMenu');
            
            if (menuToggle && navMenu) {
                menuToggle.addEventListener('click', function() {
                    navMenu.classList.toggle('active');
                });
            }
            
            // Mostrar mensagem de boas-vindas
            setTimeout(function() {
                showTip('welcome');
            }, 2000);
            
            // Atualizar progresso inicial
            updateProgress();
        });
        
        // Funções para os acordeões
        function toggleAccordion(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('.accordion-icon');

        // Fecha todos os outros acordeões da mesma seção (opcional)
        const parent = element.closest('.accordion');
            if (parent) {
            const otherContents = parent.querySelectorAll('.accordion-content');
            const otherIcons = parent.querySelectorAll('.accordion-icon');
            otherContents.forEach(item => {
                if (item !== content) item.classList.remove('open');
            });
             otherIcons.forEach(item => {
                if (item !== icon) item.classList.remove('open');
            });
        }
            
            // Alterna o estado atual
            content.classList.toggle('open');
            icon.classList.toggle('open');
            
            // Garante que o scroll funcione adequadamente quando o conteúdo é grande
            if (content.classList.contains('open')) {
                // Opcional: role para garantir que o conteúdo fique visível
                setTimeout(() => {
                    content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
            
            // Marcar progresso ao abrir um acordeão
            markSectionProgress();
        }
        
        // Exibir e fechar o modal de progresso
        function showProgressModal() {
            const modal = document.getElementById('progressModal');
            if (modal) {
                modal.style.display = 'block';
                updateProgressDisplay();
            }
        }
        
        function closeProgressModal() {
            const modal = document.getElementById('progressModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
        
        // Função para continuar leitura a partir do último ponto
        function continueReading() {
            closeProgressModal();
            
            // Lógica para rolar até a seção não concluída
            const sections = ['introducao', 'checklist', 'como-comecar', 'plano-90-dias', 'aplicacoes', 'historias', 'como-escolher', 'faq', 'glossario', 'recursos', 'conclusao'];
            
            for (let i = 0; i < sections.length; i++) {
                const completed = localStorage.getItem('section_' + sections[i]) === 'completed';
                if (!completed) {
                    const section = document.getElementById(sections[i]);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                        return;
                    }
                }
            }
        }
        
        // Funções para tracking de progresso
        function markProgress(sectionId) {
            localStorage.setItem('section_' + sectionId, 'completed');
            updateProgress();
            showTip('progress-saved');
        }
        
        function markSectionProgress() {
            // Esta função é chamada quando o usuário interage com uma seção
            // Adicionamos aqui apenas para simular progresso, mas em um sistema real
            // você pode querer usar um sistema mais sofisticado de tracking
            const currentSection = getCurrentSection();
            if (currentSection) {
                localStorage.setItem('section_' + currentSection, 'completed');
                updateProgress();
            }
        }
        
        function getCurrentSection() {
            // Determina em qual seção o usuário está baseado na posição de rolagem
            const sections = ['introducao', 'checklist', 'como-comecar', 'plano-90-dias', 'aplicacoes', 'historias', 'como-escolher', 'faq', 'glossario', 'recursos', 'conclusao'];
            
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            for (let i = 0; i < sections.length; i++) {
                const section = document.getElementById(sections[i]);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                        return sections[i];
                    }
                }
            }
            
            return null;
        }
        
        function updateProgress() {
            const sections = ['introducao', 'checklist', 'como-comecar', 'plano-90-dias', 'aplicacoes', 'historias', 'como-escolher', 'faq', 'glossario', 'recursos', 'conclusao'];
            let completedCount = 0;
            
            for (let i = 0; i < sections.length; i++) {
                const completed = localStorage.getItem('section_' + sections[i]) === 'completed';
                if (completed) {
                    completedCount++;
                }
            }
            
            // Atualizar checklist
            const checklistItems = document.querySelectorAll('#checklist input[type="checkbox"]');
            let checklistCount = 0;
            
            checklistItems.forEach(item => {
                if (item.checked) {
                    checklistCount++;
                }
            });
            
            // Se 50% ou mais dos itens do checklist estiverem marcados, considere a seção concluída
            if (checklistItems.length > 0 && checklistCount >= checklistItems.length / 2) {
                localStorage.setItem('section_checklist', 'completed');
            }
            
            // Atualizar display de progresso, se o modal estiver aberto
            updateProgressDisplay();
        }
        
        function updateProgressDisplay() {
            const sections = ['introducao', 'checklist', 'como-comecar', 'plano-90-dias', 'aplicacoes', 'historias', 'como-escolher', 'faq', 'glossario', 'recursos', 'conclusao'];
            let completedCount = 0;
            
            for (let i = 0; i < sections.length; i++) {
                const completed = localStorage.getItem('section_' + sections[i]) === 'completed';
                if (completed) {
                    completedCount++;
                }
            }
            
            // Atualizar elementos do modal de progresso
            const completedSections = document.getElementById('completedSections');
            const totalSections = document.getElementById('totalSections');
            const percentComplete = document.getElementById('percentComplete');
            const progressFill = document.getElementById('progressFill');
            
            if (completedSections && totalSections && percentComplete && progressFill) {
                completedSections.textContent = completedCount;
                totalSections.textContent = sections.length;
                
                const percentValue = Math.round((completedCount / sections.length) * 100);
                percentComplete.textContent = percentValue + '%';
                progressFill.style.width = percentValue + '%';
            }
            
            // Atualizar milestones
            updateMilestones(sections, completedCount);
        }
        
        function updateMilestones(sections, completedCount) {
            const milestones = document.querySelectorAll('.milestone');
            
            if (milestones.length > 0) {
                for (let i = 0; i < milestones.length && i < sections.length; i++) {
                    const milestone = milestones[i];
                    const section = sections[i];
                    const completed = localStorage.getItem('section_' + section) === 'completed';
                    
                    const icon = milestone.querySelector('.milestone-icon');
                    const text = milestone.querySelector('.milestone-text');
                    
                    if (completed) {
                        icon.className = 'milestone-icon milestone-complete';
                        icon.textContent = '✓';
                        text.className = 'milestone-text complete';
                    } else {
                        icon.className = 'milestone-icon milestone-pending';
                        icon.textContent = (i + 1).toString();
                        text.className = 'milestone-text';
                    }
                }
            }
        }
        
        // Funções para o checklist
        function updateChecklistResults() {
            const checklistItems = document.querySelectorAll('#checklist input[type="checkbox"]');
            let score = 0;
            
            checklistItems.forEach(item => {
                if (item.checked) {
                    score++;
                }
            });
            
            const resultContent = document.getElementById('resultContent');
            const scoreValue = document.getElementById('scoreValue');
            const readinessLevel = document.getElementById('readinessLevel');
            const recommendation = document.getElementById('recommendation');
            
            if (resultContent && scoreValue && readinessLevel && recommendation) {
                resultContent.style.display = 'block';
                scoreValue.textContent = score.toString();
                
                // Definir nível de prontidão e recomendações
                let levelText = '';
                let recommendationText = '';
                
                if (score >= 0 && score <= 4) {
                    levelText = 'FASE INICIAL';
                    recommendationText = `
                        <h5 class="font-medium mb-2">Sua empresa ainda precisa construir as bases para implementar IA</h5>
                        <p>Recomendação: Comece digitalizando seus processos principais e organizando seus dados em planilhas ou sistemas básicos</p>
                        <p class="mt-2"><strong>Ferramenta para começar:</strong> Google Sheets/Planilhas para organizar dados ou um sistema de gestão simples como Conta Azul</p>
                    `;
                } else if (score >= 5 && score <= 9) {
                    levelText = 'EM PREPARAÇÃO';
                    recommendationText = `
                        <h5 class="font-medium mb-2">Você tem algumas bases para começar, mas ainda há pontos importantes a desenvolver</h5>
                        <p>Recomendação: Escolha UMA área específica (ex: atendimento ao cliente) e implemente uma solução simples de IA</p>
                        <p class="mt-2"><strong>Ferramenta para começar:</strong> Um chatbot básico para seu WhatsApp Business ou uma ferramenta de automação de email</p>
                    `;
                } else if (score >= 10 && score <= 13) {
                    levelText = 'PRONTO PARA COMEÇAR';
                    recommendationText = `
                        <h5 class="font-medium mb-2">Sua empresa tem boa preparação para implementar IA com sucesso</h5>
                        <p>Recomendação: Siga o plano de 90 dias deste guia e comece com 2-3 áreas prioritárias</p>
                        <p class="mt-2"><strong>Ferramenta para começar:</strong> Experimente soluções mais robustas como CRM com IA integrada ou automação de processos</p>
                    `;
                } else {
                    levelText = 'AVANÇADO';
                    recommendationText = `
                        <h5 class="font-medium mb-2">Sua empresa está muito bem posicionada para se beneficiar de IA</h5>
                        <p>Recomendação: Crie uma estratégia integrada de IA para múltiplas áreas do negócio</p>
                        <p class="mt-2"><strong>Ferramenta para começar:</strong> Considere soluções personalizadas ou plataformas completas de automação de negócios</p>
                    `;
                }
                
                readinessLevel.textContent = levelText;
                recommendation.innerHTML = recommendationText;
                
                // Marcar progresso
                markProgress('checklist');
            }
        }
        
        function resetChecklist() {
            const checklistItems = document.querySelectorAll('#checklist input[type="checkbox"]');
            checklistItems.forEach(item => {
                item.checked = false;
            });
            
            const resultContent = document.getElementById('resultContent');
            if (resultContent) {
                resultContent.style.display = 'none';
            }
        }
        
        // Funções para a calculadora de ROI
        function calculateROI() {
            // Obter valores dos inputs
            const toolCost = parseFloat(document.getElementById('toolCost').value) || 0;
            const implementationHours = parseFloat(document.getElementById('implementationHours').value) || 0;
            const hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;
            const maintenanceHours = parseFloat(document.getElementById('maintenanceHours').value) || 0;
            const savedHours = parseFloat(document.getElementById('savedHours').value) || 0;
            const errorsAvoided = parseFloat(document.getElementById('errorsAvoided').value) || 0;
            const errorCost = parseFloat(document.getElementById('errorCost').value) || 0;
            const additionalSales = parseFloat(document.getElementById('additionalSales').value) || 0;
            
            // Calcular custos
            const initialCost = implementationHours * hourlyRate;
            const monthlyCost = toolCost + (maintenanceHours * hourlyRate);
            const yearCost = initialCost + (monthlyCost * 12);
            
            // Calcular benefícios
            const monthlyBenefit = (savedHours * hourlyRate) + (errorsAvoided * errorCost) + additionalSales;
            const yearBenefit = monthlyBenefit * 12;
            
            // Calcular ROI e payback
            const roi = yearCost > 0 ? ((yearBenefit - yearCost) / yearCost) * 100 : 0;
            
            let payback = "N/A";
            if (monthlyBenefit > monthlyCost) {
                const monthlyNetBenefit = monthlyBenefit - monthlyCost;
                const paybackMonths = initialCost / monthlyNetBenefit;
                
                if (paybackMonths < 1) {
                    const paybackDays = Math.round(paybackMonths * 30);
                    payback = `${paybackDays} dias`;
                } else {
                    payback = `${paybackMonths.toFixed(1)} meses`;
                }
            }
            
            // Atualizar resultados
            document.getElementById('initialCost').textContent = formatCurrency(initialCost);
            document.getElementById('monthlyCost').textContent = formatCurrency(monthlyCost);
            document.getElementById('yearCost').textContent = formatCurrency(yearCost);
            document.getElementById('monthlyBenefit').textContent = formatCurrency(monthlyBenefit);
            document.getElementById('yearBenefit').textContent = formatCurrency(yearBenefit);
            document.getElementById('roiValue').textContent = `${Math.round(roi)}%`;
            document.getElementById('paybackValue').textContent = payback;
            
            // Interpretação do ROI
            const roiInterpretation = document.getElementById('roiInterpretation');
            if (roiInterpretation) {
                let interpretationText = '';
                
                if (roi > 100) {
                    interpretationText = `
                        <p class="mb-2">
                            <span class="font-medium text-green-600">Excelente ROI!</span> Com retorno de ${Math.round(roi)}%, 
                            este investimento tem grande potencial de impacto no seu negócio. O tempo de retorno estimado 
                            de ${payback} é muito favorável.
                        </p>
                    `;
                } else if (roi > 50) {
                    interpretationText = `
                        <p class="mb-2">
                            <span class="font-medium text-green-600">Bom ROI.</span> Com retorno de ${Math.round(roi)}%, 
                            este investimento parece promissor. Você recuperará o investimento em aproximadamente ${payback}.
                        </p>
                    `;
                } else if (roi > 0) {
                    interpretationText = `
                        <p class="mb-2">
                            <span class="font-medium text-yellow-600">ROI Positivo.</span> Com retorno de ${Math.round(roi)}%, 
                            este investimento é viável, mas considere se existem alternativas com melhor retorno.
                        </p>
                    `;
                } else {
                    interpretationText = `
                        <p class="mb-2">
                            <span class="font-medium text-red-600">Atenção!</span> Com o ROI atual, este investimento não parece 
                            vantajoso financeiramente. Revise os custos e benefícios estimados ou considere outras alternativas.
                        </p>
                    `;
                }
                
                interpretationText += `
                    <p>
                        <strong>Lembre-se:</strong> Esta é uma estimativa baseada nos valores que você inseriu. Os resultados reais 
                        podem variar dependendo de fatores específicos do seu negócio e da implementação.
                    </p>
                `;
                
                roiInterpretation.innerHTML = interpretationText;
            }
            
            // Exibir resultados
            document.getElementById('roiResults').style.display = 'block';
            
            // Marcar progresso
            markProgress('como-comecar');
        }
        
        function resetROICalculator() {
            const inputs = ['toolCost', 'implementationHours', 'hourlyRate', 'maintenanceHours', 'savedHours', 'errorsAvoided', 'errorCost', 'additionalSales'];
            
            inputs.forEach(inputId => {
                document.getElementById(inputId).value = '';
            });
            
            document.getElementById('roiResults').style.display = 'none';
        }
        
        function formatCurrency(value) {
            return `R$ ${value.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
        
        // Funções para calculadora de economia financeira
 
        // Funções para geração de ideias de conteúdo
        function generateContentIdeas() {
            const sector = document.getElementById('contentSector').value;
            const theme = document.getElementById('contentTheme').value;
            const count = parseInt(document.getElementById('contentIdeasCount').value) || 5;
            
            if (sector && theme) {
                const contentIdeas = document.getElementById('contentIdeas');
                
                // Em um sistema real, isso viria de uma API ou banco de dados
                // Aqui estamos gerando respostas pré-definidas baseadas no setor
                
                let ideas = [];
                
                if (sector.toLowerCase().includes('restaurante') || sector.toLowerCase().includes('alimento')) {
                    ideas = [
                        "10 maneiras que a IA está revolucionando pedidos online de restaurantes",
                        "Como usar chatbots para automatizar reservas e diminuir faltas",
                        "Guia para criar um cardápio digital interativo com recomendações personalizadas",
                        "Automação de estoque: como prever demanda de ingredientes com IA",
                        "Análise de feedback: use IA para entender o que seus clientes realmente querem",
                        "Estratégias de precificação dinâmica para maximizar lucros em horários de pico",
                        "Marketing gastronômico: use IA para criar conteúdo irresistível nas redes sociais",
                        "Programa de fidelidade inteligente: como a IA pode identificar seus melhores clientes",
                        "Otimizando rotas de delivery com algoritmos inteligentes",
                        "Previsão de vendas: como planejar compras e escala de funcionários com IA"
                    ];
                } else if (sector.toLowerCase().includes('varejo') || sector.toLowerCase().includes('e-commerce')) {
                    ideas = [
                        "7 maneiras de usar IA para reduzir devoluções em lojas online",
                        "Assistentes virtuais: como implementar e treinar um chatbot para sua loja",
                        "Personalização em escala: recomendações de produtos que realmente funcionam",
                        "Como usar IA para otimizar preços e aumentar margens sem perder clientes",
                        "Previsão de estoque inteligente: nunca mais perca vendas por falta de produtos",
                        "Análise de sentimento: o que seus clientes estão dizendo sobre você online",
                        "Automação de remarketing: recupere carrinhos abandonados com mensagens personalizadas",
                        "Visual search: como implementar busca por imagem no seu e-commerce",
                        "Segmentação avançada: identifique micro-nichos lucrativos com IA",
                        "Experiências personalizadas: como criar uma jornada única para cada cliente"
                    ];
                } else {
                    ideas = [
                        `5 maneiras de usar IA para melhorar ${theme} em empresas de ${sector}`,
                        `Guia passo a passo: implementando automação de ${theme} com baixo orçamento`,
                        `Como empresas de ${sector} estão economizando tempo com IA em ${theme}`,
                        `3 ferramentas de IA para ${theme} que toda empresa de ${sector} deveria conhecer`,
                        `Estudo de caso: como uma pequena empresa de ${sector} transformou ${theme} com IA`,
                        `Tendências de IA para ${sector}: o que esperar nos próximos anos`,
                        `Checklist: sua empresa de ${sector} está pronta para automatizar ${theme}?`,
                        `ROI de projetos de IA: calculando o retorno em ${theme} para ${sector}`,
                        `Erros comuns ao implementar IA em ${theme} e como evitá-los`,
                        `Desmistificando a IA: soluções práticas de ${theme} para pequenas empresas de ${sector}`
                    ];
                }
                
                // Limitar ao número solicitado
                ideas = ideas.slice(0, count);
                
                // Exibir ideias
                let ideasHTML = `
                    <h5 class="font-medium mb-3">Ideias de Conteúdo para ${sector}</h5>
                    <ul>
                `;
                
                ideas.forEach(idea => {
                    ideasHTML += `<li class="mb-2">${idea}</li>`;
                });
                
                ideasHTML += `
                    </ul>
                    <div class="mt-4 text-center">
                        <button class="btn btn-secondary" onclick="document.getElementById('contentIdeas').style.display = 'none';">Fechar</button>
                        <button class="btn btn-primary" onclick="alert('Em um sistema real, este botão exportaria as ideias para um documento ou ferramenta de planejamento de conteúdo.')">Exportar Ideias</button>
                    </div>
                `;
                
                contentIdeas.innerHTML = ideasHTML;
                contentIdeas.style.display = 'block';
                
                // Marcar progresso
                markProgress('aplicacoes');
            }
        }
        
        // Funções para as histórias de caso
        function showCaseDetails(caseId) {
            const caseDetailsModal = document.getElementById('caseDetailsModal');
            const caseDetailsTitle = document.getElementById('caseDetailsTitle');
            const caseDetailsContent = document.getElementById('caseDetailsContent');
            
            if (caseDetailsModal && caseDetailsTitle && caseDetailsContent) {
                let title = '';
                let content = '';
                
                switch (caseId) {
                    case 'restaurante':
                        title = 'Estudo de Caso: Restaurante Ana';
                        content = `
                            <div class="case-study">
                                <div class="case-meta">
                                    <span class="case-sector">Setor: Gastronomia</span>
                                    <span class="case-company">Empresa: Restaurante Ana (30 mesas)</span>
                                </div>
                                <div class="case-content">
                                    <h4 class="font-medium mb-2">O Desafio</h4>
                                    <p>Ana, proprietária de um restaurante de médio porte, enfrentava diversos problemas com o sistema de reservas:</p>
                                    <ul class="mt-2 mb-4">
                                        <li>Funcionários gastavam cerca de 3 horas por dia ao telefone gerenciando reservas</li>
                                        <li>Muitas ligações eram apenas para verificar disponibilidade</li>
                                        <li>No horário de pico de atendimento, muitas chamadas eram perdidas</li>
                                        <li>Taxa de no-show (clientes que reservavam e não apareciam) em torno de 15%</li>
                                    </ul>
                                    
                                    <h4 class="font-

                                    <h4 class="font-medium mb-2">A Solução</h4>
                                    <p>Ana implementou um chatbot simples integrado ao WhatsApp Business e ao site do restaurante:</p>
                                    <ul class="mt-2 mb-4">
                                        <li>Investimento inicial: R$ 1.200 (setup e configuração)</li>
                                        <li>Custo mensal: R$ 250/mês (assinatura do serviço)</li>
                                        <li>Tempo de implementação: 2 semanas</li>
                                        <li>Funcionalidades principais:
                                            <ul class="ml-4">
                                                <li>Verificação de disponibilidade em tempo real</li>
                                                <li>Reservas automáticas com confirmação por e-mail/SMS</li>
                                                <li>Lembretes automáticos 24h antes da reserva</li>
                                                <li>Cancelamentos e alterações self-service</li>
                                            </ul>
                                        </li>
                                    </ul>
                                    
                                    <h4 class="font-medium mb-2">Os Resultados</h4>
                                    <p>Após 3 meses de uso:</p>
                                    <ul class="mt-2 mb-4">
                                        <li>Redução de 65% no tempo gasto ao telefone para reservas</li>
                                        <li>Funcionários puderam focar mais no atendimento presencial</li>
                                        <li>Aumento de 28% no número total de reservas (principalmente pelo acesso 24/7)</li>
                                        <li>Redução de 70% na taxa de no-show</li>
                                        <li>ROI calculado: 380% no primeiro ano</li>
                                    </ul>
                                    
                                    <h4 class="font-medium mb-2">Lições Aprendidas</h4>
                                    <ul class="mt-2">
                                        <li>Começar com uma solução específica para um problema claro trouxe resultados rápidos</li>
                                        <li>A integração com sistemas existentes (como o WhatsApp já usado) facilitou a adoção</li>
                                        <li>O valor do tempo economizado pelos funcionários superou o custo da implementação</li>
                                        <li>Clientes mais jovens preferiram a nova opção de reserva online</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="mt-4 text-center">
                                <button class="btn btn-primary" onclick="closeCaseDetails()">Fechar</button>
                            </div>
                        `;
                        break;
                    case 'loja':
                        title = 'Estudo de Caso: Moda Carlos';
                        content = `
                            <div class="case-study">
                                <div class="case-meta">
                                    <span class="case-sector">Setor: E-commerce de Moda</span>
                                    <span class="case-company">Empresa: Loja online com 500+ produtos</span>
                                </div>
                                <div class="case-content">
                                    <h4 class="font-medium mb-2">O Desafio</h4>
                                    <p>Carlos tinha uma loja online de roupas que enfrentava problemas frequentes:</p>
                                    <ul class="mt-2 mb-4">
                                        <li>Alta taxa de devolução (cerca de 25% das compras)</li>
                                        <li>Emails de marketing com baixas taxas de conversão (2%)</li>
                                        <li>Clientes confusos sobre que tamanhos escolher</li>
                                        <li>Cada devolução custava em média R$ 45 (entre frete, processamento e reposição)</li>
                                    </ul>
                                    
                                    <h4 class="font-medium mb-2">A Solução</h4>
                                    <p>Carlos implementou um sistema de recomendação personalizada baseado em IA:</p>
                                    <ul class="mt-2 mb-4">
                                        <li>Investimento: R$ 500/mês em uma plataforma de email marketing com recursos de IA</li>
                                        <li>Implementação: Integrou o histórico de compras e devoluções dos clientes ao sistema</li>
                                        <li>Funcionamento: A IA analisava padrões de compra, histórico de devoluções e preferências de cada cliente para recomendar produtos adequados por email</li>
                                        <li>Personalização: Os emails incluíam guias de tamanho específicos para cada cliente baseados em compras anteriores</li>
                                    </ul>
                                    
                                    <h4 class="font-medium mb-2">Os Resultados</h4>
                                    <p>Após 3 meses:</p>
                                    <ul class="mt-2 mb-4">
                                        <li>Aumento de 32% nas vendas por email</li>
                                        <li>Aumento da taxa de conversão de emails de 2% para 5.8%</li>
                                        <li>Redução de 25% no número de devoluções</li>
                                        <li>Economia de aproximadamente R$ 3.400/mês só com redução de devoluções</li>
                                        <li>ROI calculado: 580% (considerando apenas a economia em devoluções)</li>
                                    </ul>
                                    
                                    <h4 class="font-medium mb-2">Próximos Passos</h4>
                                    <p>Após o sucesso inicial, Carlos expandiu o uso de IA:</p>
                                    <ul class="mt-2">
                                        <li>Implementou recomendações na própria loja online</li>
                                        <li>Adicionou um assistente virtual para ajudar com dúvidas de tamanho</li>
                                        <li>Começou a usar IA para otimizar o estoque baseado em previsões de demanda</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="mt-4 text-center">
                                <button class="btn btn-primary" onclick="closeCaseDetails()">Fechar</button>
                            </div>
                        `;
                        break;
                    case 'clinica':
                        title = 'Estudo de Caso: Clínica Odontológica Daniela';
                        content = `
                            <div class="case-study">
                                <div class="case-meta">
                                    <span class="case-sector">Setor: Saúde / Odontologia</span>
                                    <span class="case-company">Empresa: Clínica com 3 dentistas</span>
                                </div>
                                <div class="case-content">
                                    <h4 class="font-medium mb-2">O Desafio</h4>
                                    <p>A Dra. Daniela enfrentava um problema crítico em sua clínica odontológica:</p>
                                    <ul class="mt-2 mb-4">
                                        <li>Taxa de 30% de faltas em consultas agendadas</li>
                                        <li>Cada hora ociosa representava perda de R$ 180-250</li>
                                        <li>Sistema manual de confirmação por telefone era ineficiente</li>
                                        <li>Muitos pacientes não atendiam as ligações de confirmação</li>
                                    </ul>
                                    
                                    <h4 class="font-medium mb-2">A Solução</h4>
                                    <p>Daniela implementou um sistema de gestão de consultas com IA:</p>
                                    <ul class="mt-2 mb-4">
                                        <li>Investimento: R$ 350/mês em uma plataforma especializada</li>
                                        <li>Sistema de lembretes inteligentes que:
                                            <ul class="ml-4">
                                                <li>Analisava o histórico de cada paciente para identificar perfis com maior risco de falta</li>
                                                <li>Personalizava mensagens baseadas no perfil (tom mais formal ou casual, mais ou menos detalhes)</li>
                                                <li>Enviava lembretes em horários com maior probabilidade de resposta</li>
                                                <li>Usava o canal preferido de cada paciente (WhatsApp, SMS ou email)</li>
                                            </ul>
                                        </li>
                                        <li>Sistema de lista de espera automatizado que oferecia horários cancelados para pacientes compatíveis</li>
                                    </ul>
                                    
                                    <h4 class="font-medium mb-2">Os Resultados</h4>
                                    <p>Em apenas 2 meses:</p>
                                    <ul class="mt-2 mb-4">
                                        <li>Redução de faltas de 30% para 10% (67% de redução)</li>
                                        <li>Preenchimento de 40% dos horários cancelados com a lista de espera automatizada</li>
                                        <li>Economia de aproximadamente 20 horas por mês da recepcionista</li>
                                        <li>Aumento de faturamento estimado em R$ 6.000/mês</li>
                                        <li>ROI calculado: 1.600% no primeiro ano</li>
                                    </ul>
                                    
                                    <h4 class="font-medium mb-2">Principais Insights</h4>
                                    <ul class="mt-2">
                                        <li>A personalização das mensagens foi fundamental para o aumento das confirmações</li>
                                        <li>Pacientes apreciaram a flexibilidade de canal de comunicação</li>
                                        <li>O sistema de lista de espera foi um benefício inesperado mas muito valioso</li>
                                        <li>A solução praticamente se pagou na primeira semana de uso</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="mt-4 text-center">
                                <button class="btn btn-primary" onclick="closeCaseDetails()">Fechar</button>
                            </div>
                        `;
                        break;
                    case 'fabrica':
                        title = 'Estudo de Caso: Metalúrgica Paulo';
                        content = `
                            <div class="case-study">
                                <div class="case-meta">
                                    <span class="case-sector">Setor: Manufatura / Metalurgia</span>
                                    <span class="case-company">Empresa: Pequena fábrica com 15 funcionários</span>
                                </div>
                                <div class="case-content">
                                    <h4 class="font-medium mb-2">O Desafio</h4>
                                    <p>Paulo dirigia uma pequena metalúrgica com equipamentos essenciais para a produção:</p>
                                    <ul class="mt-2 mb-4">
                                        <li>Paradas não programadas causavam prejuízos de R$ 12.000-15.000 por dia</li>
                                        <li>Sistema de manutenção era puramente reativo (consertar quando quebrava)</li>
                                        <li>Manutenção preventiva tradicional era cara e nem sempre necessária</li>
                                        <li>Peças de reposição demoravam até 2 semanas para chegar</li>
                                    </ul>
                                    
                                    <h4 class="font-medium mb-2">A Solução</h4>
                                    <p>Paulo implementou um sistema simples de manutenção preditiva com IA:</p>
                                    <ul class="mt-2 mb-4">
                                        <li>Investimento inicial: R$ 8.000 (sensores e instalação)</li>
                                        <li>Custo mensal: R$ 650 (software de monitoramento)</li>
                                        <li>Funcionamento:
                                            <ul class="ml-4">
                                                <li>Sensores monitoravam temperatura, vibração e ruído dos equipamentos críticos</li>
                                                <li>IA analisava os padrões para detectar anomalias antes de falhas completas</li>
                                                <li>Sistema alertava quando havia sinais de deterioração</li>
                                                <li>Indicava quais peças provavelmente precisariam de substituição</li>
                                            </ul>
                                        </li>
                                    </ul>
                                    
                                    <h4 class="font-medium mb-2">Os Resultados</h4>
                                    <p>Após 90 dias:</p>
                                    <ul class="mt-2 mb-4">
                                        <li>O sistema previu corretamente duas falhas potenciais com 10-14 dias de antecedência</li>
                                        <li>Paulo conseguiu programar manutenções sem interromper a produção</li>
                                        <li>Evitou duas paradas não programadas que teriam custado R$ 28.000 em produção perdida</li>
                                        <li>Reduziu o estoque de peças de reposição em 30% (compra apenas quando há previsão de necessidade)</li>
                                        <li>ROI calculado: 230% nos primeiros 3 meses</li>
                                    </ul>
                                    
                                    <h4 class="font-medium mb-2">Lições Aprendidas</h4>
                                    <ul class="mt-2">
                                        <li>A IA não detectou todos os problemas, mas os mais críticos e custosos</li>
                                        <li>O sistema se tornou mais preciso com o tempo ao aprender com os dados</li>
                                        <li>A equipe de manutenção inicialmente resistiu, mas mudou de opinião após ver os resultados</li>
                                        <li>A solução criou um ciclo virtuoso: menos quebras → mais tempo para manutenção preventiva → ainda menos quebras</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="mt-4 text-center">
                                <button class="btn btn-primary" onclick="closeCaseDetails()">Fechar</button>
                            </div>
                        `;
                        break;
                    default:
                        title = 'Estudo de Caso';
                        content = '<p>Detalhes não disponíveis para este caso.</p>';
                }
                
                caseDetailsTitle.textContent = title;
                caseDetailsContent.innerHTML = content;
                caseDetailsModal.style.display = 'block';
                
                // Marcar progresso
                markProgress('historias');
            }
        }
        
        function closeCaseDetails() {
            const caseDetailsModal = document.getElementById('caseDetailsModal');
            if (caseDetailsModal) {
                caseDetailsModal.style.display = 'none';
            }
        }
        
        // Funções para exemplos
        function showExampleModal(exampleType) {
            const exampleModal = document.getElementById('exampleModal');
            const exampleModalTitle = document.getElementById('exampleModalTitle');
            const exampleModalContent = document.getElementById('exampleModalContent');
            
            if (exampleModal && exampleModalTitle && exampleModalContent) {
                let title = '';
                let content = '';
                
                switch (exampleType) {
                    case 'beneficios':
                        title = 'Exemplos de Benefícios da IA';
                        content = `
                            <div class="case-study">
                                <h4 class="font-medium mb-3">Economia de tempo</h4>
                                <div class="card-content mb-4">
                                    <p><strong>Exemplo:</strong> Uma contadora usava 8 horas por semana fazendo conciliação bancária manual. Após implementar uma solução de IA, o tempo caiu para 45 minutos.</p>
                                    <p class="mt-2"><strong>Impacto:</strong> 7 horas e 15 minutos economizadas por semana, permitindo que ela atendesse mais clientes.</p>
                                </div>
                                
                                <h4 class="font-medium mb-3">Redução de custos</h4>
                                <div class="card-content mb-4">
                                    <p><strong>Exemplo:</strong> Um e-commerce gastava R$ 3.000/mês com devoluções por escolhas incorretas de produtos.</p>
                                    <p class="mt-2"><strong>Impacto:</strong> Com IA para recomendações personalizadas, as devoluções caíram 40%, economizando R$ 1.200/mês.</p>
                                </div>
                                
                                <h4 class="font-medium mb-3">Tomada de decisão baseada em dados</h4>
                                <div class="card-content mb-4">
                                    <p><strong>Exemplo:</strong> Uma loja física decidia intuitivamente quais produtos comprar para a próxima estação.</p>
                                    <p class="mt-2"><strong>Impacto:</strong> Com análise preditiva, reduziu estoques parados em 35% e aumentou vendas em 20% ao prever tendências com maior precisão.</p>
                                </div>
                                
                                <h4 class="font-medium mb-3">Experiência do cliente aprimorada</h4>
                                <div class="card-content mb-4">
                                    <p><strong>Exemplo:</strong> Uma empresa de software tinha tempo de resposta médio de 8 horas para tickets de suporte.</p>
                                    <p class="mt-2"><strong>Impacto:</strong> Após implementar um chatbot, 65% das dúvidas são respondidas instantaneamente, e a satisfação do cliente aumentou de 7.2 para 8.7/10.</p>
                                </div>
                                
                                <h4 class="font-medium mb-3">Vantagem competitiva</h4>
                                <div class="card-content">
                                    <p><strong>Exemplo:</strong> Uma pequena agência de marketing implementou IA para análise de tendências e criação de conteúdo.</p>
                                    <p class="mt-2"><strong>Impacto:</strong> Conseguiu oferecer insights mais profundos e produzir conteúdo 3x mais rápido, ganhando clientes de concorrentes maiores.</p>
                                </div>
                            </div>
                            <div class="mt-4 text-center">
                                <button class="btn btn-primary" onclick="closeExampleModal()">Fechar</button>
                            </div>
                        `;
                        break;
                    default:
                        title = 'Exemplos';
                        content = '<p>Conteúdo não disponível para este exemplo.</p>';
                }
                
                exampleModalTitle.textContent = title;
                exampleModalContent.innerHTML = content;
                exampleModal.style.display = 'block';
            }
        }
        
        function closeExampleModal() {
            const exampleModal = document.getElementById('exampleModal');
            if (exampleModal) {
                exampleModal.style.display = 'none';
            }
        }
        
        // Funções para dicas
        function showTip(tipId) {
            const tipPopup = document.getElementById('tipPopup');
            const tipContent = document.getElementById('tipContent');
            
            if (tipPopup && tipContent) {
                let content = '';
                
                switch (tipId) {
                    case 'welcome':
                        content = `
                            <p>Bem-vindo ao e-book interativo "IA nos Negócios"! Aqui você aprenderá como implementar inteligência artificial na sua empresa de forma prática e acessível.</p>
                            <p class="mt-2">Explore as seções, faça os testes interativos e acompanhe seu progresso.</p>
                        `;
                        break;
                    case 'progress-saved':
                        content = `
                            <p>Seu progresso foi salvo com sucesso! Você pode retomar a leitura de onde parou a qualquer momento.</p>
                            <p class="mt-2">Continue explorando as seções para desbloquear mais conteúdo.</p>
                        `;
                        break;
                    case 'ia-tipos':
                        content = `
                            <p><strong>Tipos de IA para negócios:</strong></p>
                            <ul class="mt-2">
                                <li><strong>IA Conversacional:</strong> chatbots, assistentes virtuais</li>
                                <li><strong>IA Analítica:</strong> análise de dados, previsões</li>
                                <li><strong>IA para Automação:</strong> processamento de documentos, workflows</li>
                                <li><strong>IA Criativa:</strong> geração de conteúdo, design</li>
                            </ul>
                        `;
                        break;
                    default:
                        content = '<p>Dica não disponível.</p>';
                }
                
                tipContent.innerHTML = content;
                tipPopup.style.display = 'block';
                
                // Fechar automaticamente após 15 segundos
                setTimeout(function() {
                    closeTipPopup();
                }, 15000);
            }
        }
        
        function closeTipPopup() {
            const tipPopup = document.getElementById('tipPopup');
            if (tipPopup) {
                tipPopup.style.display = 'none';
            }
        }
        
        function nextTip() {
            // Lógica para mostrar a próxima dica
            // Simplificando aqui, apenas mostrando uma dica aleatória
            const tips = ['welcome', 'progress-saved', 'ia-tipos'];
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            
            closeTipPopup();
            setTimeout(function() {
                showTip(randomTip);
            }, 500);
        }
        
        // Funções para o plano de 90 dias
        function toggleActionItems(monthId) {
            const actionsDiv = document.getElementById(monthId + 'Actions');
            if (actionsDiv) {
                if (actionsDiv.style.display === 'none') {
                    actionsDiv.style.display = 'block';
                } else {
                    actionsDiv.style.display = 'none';
                }
            }
            
            // Marcar progresso
            markProgress('plano-90-dias');
        }
        
        // Função para o glossário completo
        function toggleFullGlossary() {
            const fullGlossary = document.getElementById('fullGlossary');
            const toggleBtn = document.querySelector('[onclick="toggleFullGlossary()"]');
            
            if (fullGlossary && toggleBtn) {
                if (fullGlossary.style.display === 'none') {
                    fullGlossary.style.display = 'block';
                    toggleBtn.textContent = 'Ocultar Glossário Completo';
                } else {
                    fullGlossary.style.display = 'none';
                    toggleBtn.textContent = 'Ver Glossário Completo';
                }
            }
            
            // Marcar progresso
            markProgress('glossario');
        }

        // Adicionar esta função ao JavaScript, aproximadamente linha 4900
function showToolRecommendations() {
    const sector = document.querySelector('select[name="sector"]').value;
    const area = document.querySelector('select[name="area"]').value;
    const budget = document.querySelector('select[name="budget"]').value;
    
    const recommendationsDiv = document.getElementById('toolRecommendations');
    
    // Objeto com recomendações específicas por setor/área/orçamento
    const recommendations = {
        'varejo-atendimento-baixo': [
            { name: 'ManyChat', price: 'Gratuito/R$15/mês', description: 'Chatbot para WhatsApp e Facebook' },
            { name: 'Tidio', price: 'Gratuito até 50 conversas', description: 'Chatbot para site' }
        ],
        'servicos-marketing-medio': [
            { name: 'HubSpot', price: 'R$500/mês', description: 'Plataforma completa de marketing' },
            { name: 'RD Station', price: 'R$400/mês', description: 'Marketing automation com inteligência' }
        ],
        // Mais combinações aqui
    };
    
    // Identifica a combinação ou usa recomendação padrão
    const key = `${sector}-${area}-${budget}`;
    const tools = recommendations[key] || [
        { name: 'ChatGPT', price: 'US$20/mês', description: 'IA generativa para conteúdo e suporte' },
        { name: 'ManyChat', price: 'Gratuito/R$15/mês', description: 'Chatbot para WhatsApp e Facebook' }
    ];
    
    // Gera HTML da recomendação
    let html = `
        <h4 class="font-medium mb-3">Ferramentas Recomendadas para seu Caso</h4>
        <div class="cards">
    `;
    
    tools.forEach(tool => {
        html += `
            <div class="card">
                <h5 class="card-title">${tool.name}</h5>
                <div class="card-content">
                    <p>${tool.description}</p>
                    <p class="font-bold mt-2">${tool.price}</p>
                </div>
                <a href="#" class="btn btn-secondary" target="_blank">Ver Tutorial</a>
            </div>
        `;
    });
    
    html += `
        </div>
    `;
    
    recommendationsDiv.innerHTML = html;
    recommendationsDiv.style.display = 'block';
}

// Adicione esta função ao seu arquivo JavaScript

function showSolutionRecommendations() {
    // Obter os valores selecionados
    const sector = document.getElementById('solutionSector').value;
    const area = document.getElementById('solutionArea').value;
    const budget = document.getElementById('solutionBudget').value;
    
    // Verificar se todos os campos foram preenchidos
    if (!sector || !area || !budget) {
        alert('Por favor, preencha todos os campos para ver as recomendações.');
        return;
    }
    
    // Obter o elemento onde vamos mostrar as recomendações
    const recommendationsDiv = document.getElementById('solutionRecommendations');
    
    // Se o elemento não existe, criá-lo
    if (!recommendationsDiv) {
        const toolContent = document.querySelector('.tool-content');
        const newDiv = document.createElement('div');
        newDiv.id = 'solutionRecommendations';
        newDiv.className = 'mt-4 p-3 border rounded bg-blue-50';
        toolContent.appendChild(newDiv);
    }
    
    // Definir recomendações com base nas seleções
    const recommendations = getSolutionRecommendations(sector, area, budget);
    
    // Exibir as recomendações
    document.getElementById('solutionRecommendations').innerHTML = recommendations;
    document.getElementById('solutionRecommendations').style.display = 'block';
    
    // Marcar progresso
    markProgress('como-comecar');
}

function getSolutionRecommendations(sector, area, budget) {
    // Base de recomendações por combinação de setor, área e orçamento
    const recommendationMap = {
        // Varejo / E-commerce
        'varejo-atendimento-baixo': {
            title: 'Chatbots Básicos para Atendimento',
            tools: [
                { name: 'ManyChat', price: 'Gratuito / R$49/mês', link: '#' },
                { name: 'Tidio', price: 'Gratuito até 100 conversas/mês', link: '#' }
            ],
            description: 'Estas ferramentas permitem criar chatbots simples para responder perguntas frequentes dos clientes e automatizar interações básicas.'
        },
        'varejo-atendimento-medio': {
            title: 'Chatbots Avançados com IA',
            tools: [
                { name: 'Zendesk AI', price: 'R$300-500/mês', link: '#' },
                { name: 'Intercom', price: 'R$460/mês', link: '#' }
            ],
            description: 'Soluções com recursos avançados de IA para entender linguagem natural, integrar com seu sistema de pedidos e oferecer experiência personalizada.'
        },
        'varejo-atendimento-alto': {
            title: 'Plataformas de Atendimento Omnichannel',
            tools: [
                { name: 'Freshdesk Omnichannel', price: 'R$1.200+/mês', link: '#' },
                { name: 'Salesforce Service Cloud', price: 'R$1.500+/mês', link: '#' }
            ],
            description: 'Soluções completas que integram chatbots, e-mail, WhatsApp, e outros canais em uma só plataforma com análise avançada de comportamento.'
        },
        'varejo-marketing-baixo': {
            title: 'Ferramentas Acessíveis de Marketing com IA',
            tools: [
                { name: 'Mailchimp', price: 'Gratuito até 2.000 contatos', link: '#' },
                { name: 'Canva Pro', price: 'R$49/mês', link: '#' }
            ],
            description: 'Automatize e-mails e crie designs com assistência de IA sem grandes investimentos.'
        },
        'varejo-marketing-medio': {
            title: 'Plataformas de Marketing Automation',
            tools: [
                { name: 'RD Station', price: 'R$399+/mês', link: '#' },
                { name: 'HubSpot Starter', price: 'R$500+/mês', link: '#' }
            ],
            description: 'Automatize campanhas multicanal e personalize experiências com recursos de IA para segmentação avançada.'
        },
        'varejo-marketing-alto': {
            title: 'Plataformas Avançadas de Marketing com IA',
            tools: [
                { name: 'HubSpot Professional', price: 'R$2.000+/mês', link: '#' },
                { name: 'Marketo', price: 'R$3.000+/mês', link: '#' }
            ],
            description: 'Soluções completas para personalização em tempo real, previsão de comportamento e análise avançada de jornada do cliente.'
        },
        
        // Serviços Profissionais
        'servicos-atendimento-baixo': {
            title: 'Atendimento Automatizado para Serviços',
            tools: [
                { name: 'Calendly', price: 'Gratuito / R$40/mês', link: '#' },
                { name: 'WhatsApp Business API', price: 'Gratuito / Baseado em volume', link: '#' }
            ],
            description: 'Automatize agendamentos e respostas frequentes para otimizar seu atendimento.'
        },
        'servicos-financeiro-medio': {
            title: 'Gestão Financeira com IA',
            tools: [
                { name: 'Conta Azul', price: 'R$89+/mês', link: '#' },
                { name: 'Nibo', price: 'R$150+/mês', link: '#' }
            ],
            description: 'Automatize conciliação bancária, gestão de cobranças e previsão de fluxo de caixa.'
        },
        
        // Alimentos e Bebidas
        'alimentos-atendimento-baixo': {
            title: 'Gestão de Pedidos e Reservas',
            tools: [
                { name: 'Goomer', price: 'R$99/mês', link: '#' },
                { name: 'Agendar', price: 'Gratuito / R$50+/mês', link: '#' }
            ],
            description: 'Automatize reservas, pedidos online e gestão de filas com tecnologia acessível.'
        },
        
        // Default para todas as outras combinações
        'default': {
            title: 'Recomendações para Iniciantes em IA',
            tools: [
                { name: 'ChatGPT Plus', price: 'US$20/mês', link: '#' },
                { name: 'Airtable', price: 'Gratuito / R$50+/mês', link: '#' },
                { name: 'Zapier', price: 'Gratuito / R$70+/mês', link: '#' }
            ],
            description: 'Estas ferramentas versáteis são um bom ponto de partida para qualquer setor. Você pode usar o ChatGPT para criar conteúdo, o Airtable para organizar dados, e o Zapier para conectar sistemas sem programação.'
        }
    };
    
    // Criar chave para buscar no mapa de recomendações
    const key = `${sector}-${area}-${budget}`;
    
    // Verificar se temos recomendação específica, caso contrário usar default
    const recommendation = recommendationMap[key] || recommendationMap['default'];
    
    // Construir HTML para as recomendações
    let html = `
        <h4 class="font-medium mb-3">${recommendation.title}</h4>
        <p class="mb-4">${recommendation.description}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    `;
    
    // Adicionar cada ferramenta recomendada
    recommendation.tools.forEach(tool => {
        html += `
            <div class="p-3 bg-white rounded shadow-sm">
                <h5 class="font-medium text-primary-color">${tool.name}</h5>
                <p class="text-sm mb-2">${tool.price}</p>
                <a href="${tool.link}" class="text-blue-600 hover:underline text-sm">Saiba mais</a>
            </div>
        `;
    });
    
    html += `</div>
        <div class="mt-4 text-center">
            <button class="btn btn-secondary" onclick="showCustomizedGuide('${sector}', '${area}', '${budget}')">
                Ver Guia de Implementação
            </button>
        </div>
    `;
    
    return html;
}

// Função bônus para mostrar um guia personalizado (você pode implementar depois)
function showCustomizedGuide(sector, area, budget) {
    alert('Em uma implementação completa, esta função mostraria um guia de implementação personalizado para ' + 
          sector + ' na área de ' + area + ' com orçamento ' + budget + '.');
}

// Adicione este código à sua seção de scripts

// Inicialização do menu lateral

// Atualize a função de inicialização do menu lateral no seu arquivo JavaScript

// Versão corrigida da função de inicialização com animação correta do botão

function initSideMenu() {
    // Toggle para abrir/fechar o menu lateral usando o botão ao lado da logo
    const toggleSideMenuBtn = document.getElementById('toggleSideMenu');
    const sideMenu = document.getElementById('sideMenu');
    
    if (toggleSideMenuBtn && sideMenu) {
        // Definir estado inicial (menu aberto, botão com ícone "X")
        let isMenuOpen = true;
        toggleSideMenuBtn.classList.add('active'); // Começa com ícone X (menu aberto)
        
        toggleSideMenuBtn.addEventListener('click', function() {
            // Inverter estado do menu
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                // Abrir menu
                sideMenu.classList.remove('collapsed');
                document.body.classList.remove('menu-collapsed');
                this.classList.add('active'); // Adicionar classe active para mostrar X
            } else {
                // Fechar menu
                sideMenu.classList.add('collapsed');
                document.body.classList.add('menu-collapsed');
                this.classList.remove('active'); // Remover classe active para mostrar ícone de hambúrguer
            }
        });
    }
    
    // Resto da função permanece igual...
    const menuItems = document.querySelectorAll('.side-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });
    
    const prevButton = document.getElementById('prevSection');
    const nextButton = document.getElementById('nextSection');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', function() {
            navigateToPrevSection();
        });
        
        nextButton.addEventListener('click', function() {
            navigateToNextSection();
        });
    }
    
    window.addEventListener('scroll', updateCurrentSection);
}

// Inicialização

// Substitua sua chamada de inicialização do menu lateral existente por esta
document.addEventListener('DOMContentLoaded', function() {
    initSideMenu();
    updateSideMenuProgress();
    
    // Adicionar classe ao body para ajustar layout
    document.body.classList.add('with-side-menu');
    document.body.classList.remove('menu-collapsed'); // Garante que o menu começa aberto
    
    // Verificar último ponto de leitura e rolar até ele
    checkLastReadingPoint();
});
function updateSideMenuProgress() {
    const sections = ['introducao', 'checklist', 'fundamentos', 'aplicacoes', 'historias', 'como-comecar', 'plano-90-dias', 'etica-legal', 'recursos'];
    let completedCount = 0;
    
    // Verifica seções concluídas no localStorage
    sections.forEach(section => {
        const completed = localStorage.getItem('section_' + section) === 'completed';
        if (completed) {
            completedCount++;
            // Atualiza mini barra de progresso do item no menu
            const menuItem = document.querySelector(`.side-menu-item[data-section="${section}"]`);
            if (menuItem) {
                const progressBar = menuItem.querySelector('.progress-mini-fill');
                if (progressBar) {
                    progressBar.style.width = '100%';
                }
            }
        }
    });
    
    // Calcula porcentagem total
    const totalSections = sections.length;
    const percentComplete = Math.round((completedCount / totalSections) * 100);
    
    // Atualiza barra de progresso principal no menu
    const progressFill = document.getElementById('sideMenuProgressFill');
    const progressText = document.getElementById('sideMenuProgress');
    
    if (progressFill && progressText) {
        progressFill.style.width = percentComplete + '%';
        progressText.textContent = percentComplete;
    }
}

function updateCurrentSection() {
    const sections = ['introducao', 'checklist', 'fundamentos', 'aplicacoes', 'historias', 'como-comecar', 'plano-90-dias', 'etica-legal', 'recursos'];
    
    // Encontra a seção visível atualmente baseada na posição de rolagem
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    let currentSection = null;
    
    for (let i = 0; i < sections.length; i++) {
        const section = document.getElementById(sections[i]);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                currentSection = sections[i];
                break;
            }
        }
    }
    
    if (currentSection) {
        // Destaca item no menu lateral
        const menuItems = document.querySelectorAll('.side-menu-item');
        menuItems.forEach(item => {
            if (item.getAttribute('data-section') === currentSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Salva posição para retomar leitura posteriormente
        localStorage.setItem('last_section', currentSection);
        localStorage.setItem('last_scroll', window.scrollY);
    }
}

function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 100, // Ajuste para compensar cabeçalho fixo
            behavior: 'smooth'
        });
    }
}

function navigateToPrevSection() {
    const sections = ['introducao', 'checklist', 'fundamentos', 'aplicacoes', 'historias', 'como-comecar', 'plano-90-dias', 'etica-legal', 'recursos'];
    const currentSection = localStorage.getItem('last_section') || 'introducao';
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex > 0) {
        navigateToSection(sections[currentIndex - 1]);
    }
}

function navigateToNextSection() {
    const sections = ['introducao', 'checklist', 'fundamentos', 'aplicacoes', 'historias', 'como-comecar', 'plano-90-dias', 'etica-legal', 'recursos'];
    const currentSection = localStorage.getItem('last_section') || 'introducao';
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
        navigateToSection(sections[currentIndex + 1]);
    }
}

function checkLastReadingPoint() {
    const lastSection = localStorage.getItem('last_section');
    const lastScroll = localStorage.getItem('last_scroll');
    
    if (lastSection && lastScroll) {
        // Opcional: Perguntar ao usuário se quer continuar de onde parou
        const continueReading = confirm('Deseja continuar a leitura de onde parou?');
        
        if (continueReading) {
            window.scrollTo({
                top: parseInt(lastScroll),
                behavior: 'smooth'
            });
        }
    }
}

// Estenda a função updateProgress existente para atualizar também o menu lateral
const originalUpdateProgress = updateProgress;
updateProgress = function() {
    originalUpdateProgress.call(this);
    updateSideMenuProgress();
};

// Estenda a função markProgress existente
const originalMarkProgress = markProgress;
markProgress = function(sectionId) {
    originalMarkProgress.call(this, sectionId);
    
    // Atualiza visualmente o progresso no menu lateral
    const menuItem = document.querySelector(`.side-menu-item[data-section="${sectionId}"]`);
    if (menuItem) {
        const progressBar = menuItem.querySelector('.progress-mini-fill');
        if (progressBar) {
            progressBar.style.width = '100%';
        }
    }
    
    updateSideMenuProgress();
};

// Funcionalidades para o checklist interativo

// Inicialização do checklist interativo
document.addEventListener('DOMContentLoaded', function() {
    initChecklistTabs();
});

// Função para inicializar as tabs do checklist
function initChecklistTabs() {
    const tabs = document.querySelectorAll('.checklist-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover classe 'active' de todas as tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Adicionar classe 'active' à tab clicada
            this.classList.add('active');
            
            // Mostrar conteúdo correspondente
            const targetId = this.getAttribute('data-target');
            const tabContents = document.querySelectorAll('.checklist-tab-content');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // Configurar navegação entre tabs
    const nextButtons = document.querySelectorAll('.next-tab');
    const prevButtons = document.querySelectorAll('.prev-tab');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextTabId = this.getAttribute('data-next');
            const nextTabTrigger = document.querySelector(`.checklist-tab[data-target="${nextTabId}"]`);
            if (nextTabTrigger) {
                nextTabTrigger.click();
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevTabId = this.getAttribute('data-prev');
            const prevTabTrigger = document.querySelector(`.checklist-tab[data-target="${prevTabId}"]`);
            if (prevTabTrigger) {
                prevTabTrigger.click();
            }
        });
    });
}

// Função para atualizar feedback visual dos items do checklist
function updateChecklistVisualFeedback(checkbox) {
    const checklistItem = checkbox.closest('.checklist-item');
    const positiveText = checklistItem.querySelector('.feedback-positive');
    const negativeText = checklistItem.querySelector('.feedback-negative');
    
    if (checkbox.checked) {
        positiveText.classList.remove('hidden');
        negativeText.classList.add('hidden');
        checklistItem.style.borderLeft = '4px solid #10b981';
    } else {
        positiveText.classList.add('hidden');
        negativeText.classList.remove('hidden');
        checklistItem.style.borderLeft = '4px solid #f59e0b';
    }
}

// Função para mostrar os resultados do checklist
// Função para mostrar os resultados do checklist
function showChecklistResults() {
    // Contar checkboxes marcados por categoria
    const dataInfraChecks = countChecksInRange(1, 4);
    const processosChecks = countChecksInRange(5, 9);
    const pessoasChecks = countChecksInRange(10, 13);
    const recursosChecks = countChecksInRange(14, 17);
    
    const totalChecks = dataInfraChecks + processosChecks + pessoasChecks + recursosChecks;
    
    // Atualizar pontuações no gráfico
    document.querySelector('#quadrantDataInfra .quadrant-score').textContent = `${dataInfraChecks}/4`;
    document.querySelector('#quadrantProcessos .quadrant-score').textContent = `${processosChecks}/4`;
    document.querySelector('#quadrantPessoas .quadrant-score').textContent = `${pessoasChecks}/4`;
    document.querySelector('#quadrantRecursos .quadrant-score').textContent = `${recursosChecks}/4`;
    
    // Animar preenchimento dos quadrantes
    animateQuadrantFill('quadrantDataInfra', dataInfraChecks * 25);
    animateQuadrantFill('quadrantProcessos', processosChecks * 25);
    animateQuadrantFill('quadrantPessoas', pessoasChecks * 25);
    animateQuadrantFill('quadrantRecursos', recursosChecks * 25);
    
    // Atualizar pontuação total
    document.getElementById('scoreValue').textContent = `${totalChecks}/16`;
    
    // Determinar nível de prontidão
    let readinessLevel = '';
    let readinessClass = '';
    
    if (totalChecks >= 0 && totalChecks <= 4) {
        readinessLevel = 'FASE INICIAL';
        readinessClass = 'readiness-initial';
    } else if (totalChecks >= 5 && totalChecks <= 9) {
        readinessLevel = 'EM PREPARAÇÃO';
        readinessClass = 'readiness-preparing';
    } else if (totalChecks >= 10 && totalChecks <= 13) {
        readinessLevel = 'PRONTO PARA COMEÇAR';
        readinessClass = 'readiness-ready';
    } else {
        readinessLevel = 'AVANÇADO';
        readinessClass = 'readiness-advanced';
    }
    
    const readinessElement = document.getElementById('readinessLevel');
    readinessElement.textContent = readinessLevel;
    readinessElement.className = readinessClass;
    
    // Identificar pontos fortes e fracos
    const areas = [
        { name: 'Dados e Infraestrutura', score: dataInfraChecks },
        { name: 'Processos e Operações', score: processosChecks },
        { name: 'Pessoas e Cultura', score: pessoasChecks },
        { name: 'Recursos e Preparo', score: recursosChecks }
    ];
    
    // Ordenar áreas por pontuação
    areas.sort((a, b) => b.score - a.score);
    
    // Identificar pontos fortes (áreas com pontuação 3 ou 4)
    const strongAreas = areas.filter(area => area.score >= 3).map(area => area.name);
    
    // Identificar pontos fracos (áreas com pontuação 0 ou 1)
    const weakAreas = areas.filter(area => area.score <= 1).map(area => area.name);
    
    // Atualizar pontos fortes e fracos
    document.getElementById('strongPoints').textContent = strongAreas.length > 0 ? strongAreas.join(', ') : 'Nenhuma área com pontuação alta';
    document.getElementById('weakPoints').textContent = weakAreas.length > 0 ? weakAreas.join(', ') : 'Nenhuma área com pontuação muito baixa';
    
    // Gerar recomendações personalizadas
    generateRecommendations(readinessLevel, strongAreas, weakAreas, areas);
    
    // Gerar roadmap com base nos resultados
    generateRoadmap(readinessLevel, weakAreas, areas);
    
    // Mostrar resultados
    document.getElementById('checklistResults').style.display = 'block';
    document.getElementById('resultContent').style.display = 'block';
    document.getElementById('shareResultsContainer').style.display = 'block';
    
    // Rolar para os resultados
    document.getElementById('checklistResults').scrollIntoView({ behavior: 'smooth' });
    
    // Marcar progresso
    markProgress('checklist');
}

// Função para contar checkboxes marcados em um intervalo
function countChecksInRange(start, end) {
    let count = 0;
    for (let i = start; i <= end; i++) {
        const checkbox = document.getElementById(`check${i}`);
        if (checkbox && checkbox.checked) {
            count++;
        }
    }
    return count;
}

// Função para animar o preenchimento dos quadrantes
function animateQuadrantFill(quadrantId, percentage) {
    const quadrant = document.getElementById(quadrantId);
    if (quadrant) {
        const fill = quadrant.querySelector('.quadrant-fill');
        setTimeout(() => {
            fill.style.height = percentage + '%';
        }, 500); // Pequeno delay para efeito visual
    }
}

// Função para gerar recomendações personalizadas
function generateRecommendations(level, strongAreas, weakAreas, allAreas) {
    const recommendationContainer = document.querySelector('.recommendation-content');
    let recommendationsHTML = '';
    
    // Recomendações gerais baseadas no nível
    switch(level) {
        case 'FASE INICIAL':
            recommendationsHTML += `
                <div class="recommendation-section">
                    <h5>Sua empresa ainda precisa construir as bases para implementar IA</h5>
                    <p>Recomendação: Foque primeiro em digitalizar seus processos principais e organizar seus dados em sistemas digitais antes de investir em IA.</p>
                    <div class="recommendation-action">
                        <strong>Próximos passos:</strong>
                        <ul>
                            <li>Migre processos em papel para planilhas digitais</li>
                            <li>Adote um sistema de gestão básico</li>
                            <li>Desenvolva competências digitais básicas na equipe</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
        case 'EM PREPARAÇÃO':
            recommendationsHTML += `
                <div class="recommendation-section">
                    <h5>Você tem algumas bases para começar, mas ainda há pontos importantes a desenvolver</h5>
                    <p>Recomendação: Selecione UMA área específica com dados já organizados para implementar um projeto piloto de IA simples.</p>
                    <div class="recommendation-action">
                        <strong>Próximos passos:</strong>
                        <ul>
                            <li>Escolha uma ferramenta de IA pronta para uso em uma área com dados estruturados</li>
                            <li>Implemente um projeto piloto com escopo limitado</li>
                            <li>Meça resultados para justificar expansão</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
        case 'PRONTO PARA COMEÇAR':
            recommendationsHTML += `
                <div class="recommendation-section">
                    <h5>Sua empresa tem boa preparação para implementar IA com sucesso</h5>
                    <p>Recomendação: Siga o plano de 90 dias deste guia e comece com 2-3 áreas prioritárias identificadas na sua avaliação.</p>
                    <div class="recommendation-action">
                        <strong>Próximos passos:</strong>
                        <ul>
                            <li>Adote soluções mais robustas como CRM com IA integrada</li>
                            <li>Integre diferentes ferramentas para criar um ecossistema</li>
                            <li>Desenvolva uma estratégia de dados mais avançada</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
        case 'AVANÇADO':
            recommendationsHTML += `
                <div class="recommendation-section">
                    <h5>Sua empresa está muito bem posicionada para se beneficiar de IA</h5>
                    <p>Recomendação: Crie uma estratégia integrada de IA para múltiplas áreas do negócio e considere soluções mais personalizadas.</p>
                    <div class="recommendation-action">
                        <strong>Próximos passos:</strong>
                        <ul>
                            <li>Considere desenvolver soluções personalizadas para seu negócio</li>
                            <li>Explore tecnologias mais avançadas como machine learning específico</li>
                            <li>Forme uma equipe ou encontre parceiros especializados em IA</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
    }
    
    // Recomendações específicas para áreas fracas
    if (weakAreas.length > 0) {
        recommendationsHTML += `
            <div class="recommendation-section">
                <h5>Recomendações específicas para áreas a melhorar</h5>
                <div class="recommendation-items">
        `;
        
        weakAreas.forEach(area => {
            switch(area) {
                case 'Dados e Infraestrutura':
                    recommendationsHTML += `
                        <div class="recommendation-item">
                        <h6>Dados e Infraestrutura</h6>
                            <p>Você precisa construir uma base sólida de dados digitais antes de implementar IA:</p>
                            <ul>
                                <li>Comece digitalizando documentos em papel e crie planilhas estruturadas</li>
                                <li>Adote um sistema de gestão, mesmo que básico (existem opções gratuitas)</li>
                                <li>Melhore sua conexão com a internet e infraestrutura de dispositivos</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'Processos e Operações':
                    recommendationsHTML += `
                        <div class="recommendation-item">
                            <h6>Processos e Operações</h6>
                            <p>Otimize e documente seus processos antes de automatizá-los:</p>
                            <ul>
                                <li>Mapeie processos atuais, identificando entradas, saídas e gargalos</li>
                                <li>Elimine etapas redundantes antes de aplicar IA</li>
                                <li>Crie documentação clara dos processos principais</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'Pessoas e Cultura':
                    recommendationsHTML += `
                        <div class="recommendation-item">
                            <h6>Pessoas e Cultura</h6>
                            <p>Desenvolva as competências e a mentalidade da equipe:</p>
                            <ul>
                                <li>Ofereça treinamentos básicos em ferramentas digitais</li>
                                <li>Identifique um "campeão digital" na equipe para liderar iniciativas</li>
                                <li>Promova uma cultura de experimentação e aprendizado contínuo</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'Recursos e Preparo':
                    recommendationsHTML += `
                        <div class="recommendation-item">
                            <h6>Recursos e Preparo</h6>
                            <p>Planeje seus investimentos em tecnologia estrategicamente:</p>
                            <ul>
                                <li>Reserve pelo menos 2-3 horas semanais para aprender e implementar novas ferramentas</li>
                                <li>Comece com soluções gratuitas ou de baixo custo para validar o conceito</li>
                                <li>Defina métricas claras para avaliar o retorno de cada investimento</li>
                            </ul>
                        </div>
                    `;
                    break;
            }
        });
        
        recommendationsHTML += `
                </div>
            </div>
        `;
    }
    
    // Sugestões de ferramentas baseadas no nível e áreas fortes
    recommendationsHTML += `
        <div class="recommendation-section">
            <h5>Ferramentas de IA recomendadas para seu perfil</h5>
            <div class="tool-recommendations">
    `;
    
    // Determinar categoria de ferramentas com base no nível e áreas fortes
    let recommendedTools = [];
    
    if (level === 'FASE INICIAL') {
        recommendedTools = [
            { name: 'Google Workspace', description: 'Suite completa para digitalização de documentos e colaboração', price: 'Gratuito / A partir de R$24/mês' },
            { name: 'Trello', description: 'Gestão visual de tarefas e projetos com automações básicas', price: 'Gratuito / A partir de R$45/mês' },
            { name: 'ChatGPT', description: 'IA generativa para criar conteúdo e automatizar redação', price: 'Gratuito / Plus por US$20/mês' }
        ];
    } else if (level === 'EM PREPARAÇÃO') {
        if (strongAreas.includes('Dados e Infraestrutura')) {
            recommendedTools.push({ name: 'Zoho Analytics', description: 'Análise de dados empresariais com recursos de IA', price: 'A partir de R$200/mês' });
        }
        if (strongAreas.includes('Processos e Operações')) {
            recommendedTools.push({ name: 'Make (Integromat)', description: 'Automação de fluxos de trabalho sem código', price: 'Gratuito / A partir de R$100/mês' });
        }
        if (strongAreas.includes('Pessoas e Cultura')) {
            recommendedTools.push({ name: 'Gupy', description: 'Recrutamento e seleção com IA', price: 'A partir de R$290/mês' });
        }
        
        // Adicionar ferramenta genérica se nenhuma específica foi adicionada
        if (recommendedTools.length === 0) {
            recommendedTools = [
                { name: 'ManyChat', description: 'Chatbots para WhatsApp e redes sociais', price: 'Gratuito / A partir de R$15/mês' },
                { name: 'Canva Pro', description: 'Design com recursos de IA', price: 'R$50/mês' }
            ];
        }
    } else if (level === 'PRONTO PARA COMEÇAR' || level === 'AVANÇADO') {
        recommendedTools = [
            { name: 'HubSpot', description: 'CRM com recursos avançados de IA para marketing, vendas e suporte', price: 'Gratuito / A partir de R$500/mês' },
            { name: 'Zapier', description: 'Automação avançada entre diferentes plataformas', price: 'Gratuito / A partir de R$200/mês' },
            { name: 'Jasper', description: 'IA avançada para criação de conteúdo', price: 'A partir de R$300/mês' }
        ];
    }
    
    // Adicionar ferramentas recomendadas ao HTML
    recommendedTools.forEach(tool => {
        recommendationsHTML += `
            <div class="tool-card">
                <h6 class="tool-name">${tool.name}</h6>
                <p class="tool-description">${tool.description}</p>
                <div class="tool-price">${tool.price}</div>
            </div>
        `;
    });
    
    recommendationsHTML += `
            </div>
        </div>
    `;
    
    // Atualizar o conteúdo das recomendações
    recommendationContainer.innerHTML = recommendationsHTML;
}

// Função para gerar roadmap personalizado
function generateRoadmap(level, weakAreas, allAreas) {
    // Ordenar áreas da mais fraca para a mais forte para priorização
    allAreas.sort((a, b) => a.score - b.score);
    
    // Definir etapas do roadmap com base no nível e áreas fracas
    const step1Element = document.getElementById('roadmapStep1');
    const step2Element = document.getElementById('roadmapStep2');
    const step3Element = document.getElementById('roadmapStep3');
    
    // Etapa 1: Foco na área mais fraca ou na preparação básica
    if (allAreas[0].score <= 1) {
        // Se tiver uma área muito fraca, focar nela primeiro
        switch (allAreas[0].name) {
            case 'Dados e Infraestrutura':
                step1Element.innerHTML = `
                    <h5>Digitalização e Organização de Dados (1-2 meses)</h5>
                    <p>Focando na base fundamental: seus dados.</p>
                    <ul>
                        <li>Migre documentos em papel para formatos digitais</li>
                        <li>Padronize a estrutura das informações (planilhas, bancos de dados)</li>
                        <li>Implemente um sistema básico de armazenamento na nuvem</li>
                    </ul>
                `;
                break;
            case 'Processos e Operações':
                step1Element.innerHTML = `
                    <h5>Mapeamento e Otimização de Processos (1-2 meses)</h5>
                    <p>Documentando e melhorando os fluxos de trabalho.</p>
                    <ul>
                        <li>Identifique e documente os 3-5 processos mais importantes</li>
                        <li>Elimine etapas redundantes e simplifique fluxos</li>
                        <li>Crie indicadores de desempenho para cada processo</li>
                    </ul>
                `;
                break;
            case 'Pessoas e Cultura':
                step1Element.innerHTML = `
                    <h5>Desenvolvimento de Competências Digitais (1-2 meses)</h5>
                    <p>Preparando sua equipe para adoção de novas tecnologias.</p>
                    <ul>
                        <li>Identifique gaps de conhecimento digital na equipe</li>
                        <li>Ofereça treinamentos básicos em ferramentas digitais</li>
                        <li>Designe um "campeão digital" para liderar iniciativas</li>
                    </ul>
                `;
                break;
            case 'Recursos e Preparo':
                step1Element.innerHTML = `
                    <h5>Planejamento de Recursos Tecnológicos (1-2 meses)</h5>
                    <p>Alocando tempo e orçamento para inovação.</p>
                    <ul>
                        <li>Reserve tempo semanal dedicado à experimentação de novas ferramentas</li>
                        <li>Defina um orçamento pequeno mas consistente para tecnologia</li>
                        <li>Pesquise e experimente soluções gratuitas ou de baixo custo</li>
                    </ul>
                `;
                break;
        }
    } else {
        // Se não tiver áreas muito fracas, começar com um projeto piloto simples
        step1Element.innerHTML = `
            <h5>Projeto Piloto de IA Simples (1 mês)</h5>
            <p>Experimentando uma solução básica de IA em área de baixo risco.</p>
            <ul>
                <li>Escolha uma ferramenta pronta para uso com trial gratuito</li>
                <li>Aplique em um processo não-crítico para aprendizado</li>
                <li>Documente resultados e lições aprendidas</li>
            </ul>
        `;
    }
    
    // Etapa 2: Implementação inicial ou expansão
    if (level === 'FASE INICIAL' || level === 'EM PREPARAÇÃO') {
        step2Element.innerHTML = `
            <h5>Primeira Implementação de IA (2-3 meses)</h5>
            <p>Aplicando IA em uma área específica com resultado tangível.</p>
            <ul>
                <li>Escolha UMA área com dados já organizados</li>
                <li>Implemente uma solução simples (ex: automação de email, chatbot básico)</li>
                <li>Defina métricas claras para medir sucesso</li>
            </ul>
        `;
    } else {
        step2Element.innerHTML = `
            <h5>Expansão Estratégica (2-3 meses)</h5>
            <p>Ampliando o uso de IA para múltiplas áreas.</p>
            <ul>
                <li>Implemente 2-3 soluções integradas em diferentes departamentos</li>
                <li>Crie um "centro de excelência" interno para IA</li>
                <li>Desenvolva uma estratégia de dados mais robusta</li>
            </ul>
        `;
    }
    
    // Etapa 3: Expansão ou Aprimoramento
    if (level === 'FASE INICIAL') {
        step3Element.innerHTML = `
            <h5>Expansão Gradual (3-6 meses)</h5>
            <p>Ampliando o uso de IA com base nos primeiros sucessos.</p>
            <ul>
                <li>Expanda a solução inicial para mais áreas</li>
                <li>Implemente uma segunda ferramenta de IA em outra área</li>
                <li>Inicie treinamentos mais avançados para a equipe</li>
            </ul>
        `;
    } else if (level === 'EM PREPARAÇÃO' || level === 'PRONTO PARA COMEÇAR') {
        step3Element.innerHTML = `
            <h5>Integração e Otimização (3-6 meses)</h5>
            <p>Conectando diferentes soluções de IA para maior impacto.</p>
            <ul>
                <li>Integre diferentes ferramentas usando plataformas como Zapier</li>
                <li>Implemente análise de dados avançada para decisões estratégicas</li>
                <li>Crie painéis de monitoramento de desempenho das soluções</li>
            </ul>
        `;
    } else {
        step3Element.innerHTML = `
            <h5>Inovação Avançada (3-6 meses)</h5>
            <p>Explorando fronteiras mais avançadas da IA.</p>
            <ul>
                <li>Considere desenvolver soluções personalizadas para seu negócio</li>
                <li>Explore áreas como Machine Learning para previsões específicas</li>
                <li>Estabeleça parcerias com especialistas ou startups de IA</li>
            </ul>
        `;
    }
}

// Função para salvar os resultados do checklist
function saveChecklistResults() {
    // Salvar resultado completo em localStorage para referência futura
    const dataInfraChecks = countChecksInRange(1, 4);
    const processosChecks = countChecksInRange(5, 8);
    const pessoasChecks = countChecksInRange(9, 12);
    const recursosChecks = countChecksInRange(13, 16);
    const totalChecks = dataInfraChecks + processosChecks + pessoasChecks + recursosChecks;
    
    const checklistData = {
        date: new Date().toISOString(),
        scores: {
            dataInfra: dataInfraChecks,
            processos: processosChecks,
            pessoas: pessoasChecks,
            recursos: recursosChecks,
            total: totalChecks
        }
    };
    
    localStorage.setItem('checklist_results', JSON.stringify(checklistData));
    
    // Exibir mensagem de confirmação
    alert('Seus resultados foram salvos com sucesso! Você poderá acessá-los novamente quando retornar ao e-book.');
    
    // Mostrar container de compartilhamento
    document.getElementById('shareResultsContainer').style.display = 'block';
}

// Função para baixar resultados em PDF (simulada)

// Funcionalidades para a seção Fundamentos de Aplicações de IA

document.addEventListener('DOMContentLoaded', function() {
    initCardSelectors();
    initDecisionTree();
    initQuiz();
});

// Inicializar os seletores de cards interativos
function initCardSelectors() {
    const selectorItems = document.querySelectorAll('.card-selector-item');
    
    selectorItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover classe 'active' de todos os seletores
            selectorItems.forEach(selector => {
                selector.classList.remove('active');
            });
            
            // Adicionar classe 'active' ao seletor clicado
            this.classList.add('active');
            
            // Mostrar conteúdo correspondente
            const targetId = this.getAttribute('data-target');
            const cardContents = document.querySelectorAll('.card-content');
            
            cardContents.forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(targetId).classList.add('active');
            
            // Marcar progresso
            markProgress('fundamentos');
        });
    });
}

// Inicializar a árvore de decisão interativa
function initDecisionTree() {
    const rootOptions = document.querySelectorAll('.root-node .node-option');
    
    // Ao clicar em uma opção na raiz da árvore
    rootOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Esconder todos os ramos
            const branches = document.querySelectorAll('.tree-branch');
            branches.forEach(branch => {
                branch.style.display = 'none';
            });
            
            // Esconder todos os resultados
            hideAllResults();
            
            // Mostrar o ramo correspondente
            const branchId = this.getAttribute('data-path');
            const branch = document.getElementById(branchId);
            if (branch) {
                branch.style.display = 'block';
                
                // Adicionar animação para mostrar a conexão do ramo
                setTimeout(() => {
                    branch.querySelector('.branch-connection').style.height = '30px';
                }, 100);
            }
        });
    });
    
    // Ao clicar em uma opção nos nós filhos da árvore
    const childOptions = document.querySelectorAll('.tree-branch .node-option');
    childOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Esconder todos os resultados
            hideAllResults();
            
            // Mostrar o resultado correspondente
            const resultId = 'result-' + this.getAttribute('data-result');
            const result = document.getElementById(resultId);
            if (result) {
                result.style.display = 'block';
                result.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

// Função para esconder todos os resultados da árvore de decisão
function hideAllResults() {
    const results = document.querySelectorAll('.tree-result');
    results.forEach(result => {
        result.style.display = 'none';
    });
}

// Inicializar o quiz interativo
function initQuiz() {
    const checkAnswersButton = document.getElementById('checkAnswers');
    const retryQuizButton = document.getElementById('retryQuiz');
    
    if (checkAnswersButton) {
        checkAnswersButton.addEventListener('click', checkQuizAnswers);
    }
    
    if (retryQuizButton) {
        retryQuizButton.addEventListener('click', resetQuiz);
    }
}

// Verificar respostas do quiz
function checkQuizAnswers() {
    let correctAnswers = 0;
    const totalQuestions = 3;
    
    // Verificar cada questão
    for (let i = 1; i <= totalQuestions; i++) {
        const questionElement = document.getElementById(`question${i}`);
        const selectedOption = questionElement.querySelector('input[type="radio"]:checked');
        
        if (selectedOption) {
            const optionParent = selectedOption.closest('.question-option');
            const isCorrect = optionParent.getAttribute('data-correct') === 'true';
            
            // Mostrar feedback
            const correctFeedback = questionElement.querySelector('.question-feedback.correct');
            const incorrectFeedback = questionElement.querySelector('.question-feedback.incorrect');
            
            if (isCorrect) {
                correctAnswers++;
                correctFeedback.classList.remove('hidden');
                incorrectFeedback.classList.add('hidden');
                optionParent.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            } else {
                correctFeedback.classList.add('hidden');
                incorrectFeedback.classList.remove('hidden');
                optionParent.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                
                // Destacar a opção correta
                const correctOption = questionElement.querySelector('.question-option[data-correct="true"]');
                if (correctOption) {
                    correctOption.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                    correctOption.style.fontWeight = 'bold';
                }
            }
            
            // Desabilitar as opções após verificação
            const allOptions = questionElement.querySelectorAll('input[type="radio"]');
            allOptions.forEach(option => {
                option.disabled = true;
            });
        }
    }
    
    // Atualizar pontuação e mostrar botões correspondentes
    document.getElementById('scoreNumber').textContent = `${correctAnswers}/${totalQuestions}`;
    document.getElementById('quizScore').classList.remove('hidden');
    document.getElementById('checkAnswers').classList.add('hidden');
    document.getElementById('retryQuiz').classList.remove('hidden');
    
    // Se acertar todas as questões, marcar progresso
    if (correctAnswers === totalQuestions) {
        markProgress('fundamentos');
    }
}

// Resetar o quiz para tentar novamente
function resetQuiz() {
    const totalQuestions = 3;
    
    // Resetar cada questão
    for (let i = 1; i <= totalQuestions; i++) {
        const questionElement = document.getElementById(`question${i}`);
        
        // Esconder feedbacks
        const correctFeedback = questionElement.querySelector('.question-feedback.correct');
        const incorrectFeedback = questionElement.querySelector('.question-feedback.incorrect');
        correctFeedback.classList.add('hidden');
        incorrectFeedback.classList.add('hidden');
        
        // Desmarcar opções
        const allOptions = questionElement.querySelectorAll('input[type="radio"]');
        allOptions.forEach(option => {
            option.checked = false;
            option.disabled = false;
        });
        
        // Resetar estilos das opções
        const optionElements = questionElement.querySelectorAll('.question-option');
        optionElements.forEach(option => {
            option.style.backgroundColor = '';
            option.style.fontWeight = '';
        });
    }
    
    // Esconder pontuação e resetar botões
    document.getElementById('quizScore').classList.add('hidden');
    document.getElementById('checkAnswers').classList.remove('hidden');
    document.getElementById('retryQuiz').classList.add('hidden');
}

// Animação para as barras de complexidade

// Ao clicar nos botões de navegação entre seções
document.addEventListener('DOMContentLoaded', function() {
    const prevButton = document.getElementById('prevSection');
    const nextButton = document.getElementById('nextSection');
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            navigateToSection('checklist');
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            navigateToSection('aplicacoes');
        });
    }
});

// Funcionalidades para o Plano de 90 Dias Interativo

document.addEventListener('DOMContentLoaded', function() {
    initRoadmapPhases();
    initWeekTabs();
    initProgressMarkers();
    setupRoadmapButtons();
});

// Inicializar fases do roadmap
function initRoadmapPhases() {
    const phases = document.querySelectorAll('.roadmap-phase');
    
    phases.forEach(phase => {
        phase.addEventListener('click', function() {
            // Remover classe 'active' de todas as fases
            phases.forEach(p => {
                p.classList.remove('active');
            });
            
            // Adicionar classe 'active' à fase clicada
            this.classList.add('active');
            
            // Mostrar conteúdo correspondente
            const phaseId = this.getAttribute('data-phase');
            const phaseContents = document.querySelectorAll('.phase-content');
            
            phaseContents.forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(`${phaseId}-content`).classList.add('active');
            
            // Atualizar marcadores de progresso
            updateProgressMarkers(phaseId);
            
            // Marcar progresso
            markProgress('plano-90-dias');
        });
    });
}

// Inicializar tabs de semanas
function initWeekTabs() {
    const weekTabs = document.querySelectorAll('.week-tab');
    
    weekTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Encontrar o container pai (fase específica)
            const phaseContent = this.closest('.phase-content');
            if (!phaseContent) return;
            
            // Remover classe 'active' de todas as tabs nesta fase
            const siblings = phaseContent.querySelectorAll('.week-tab');
            siblings.forEach(sib => {
                sib.classList.remove('active');
            });
            
            // Adicionar classe 'active' à tab clicada
            this.classList.add('active');
            
            // Mostrar conteúdo da semana correspondente
            const weekNumber = this.getAttribute('data-week');
            const weekDetails = phaseContent.querySelectorAll('.week-detail');
            
            weekDetails.forEach(detail => {
                detail.classList.remove('active');
            });
            
            // Buscar a semana pelo ID específico dentro desta fase
            const targetWeek = phaseContent.querySelector(`#week-${weekNumber}`);
            if (targetWeek) {
                targetWeek.classList.add('active');
            }
            
            // Atualizar marcador de progresso para a semana selecionada
            updateActiveProgressMarker(weekNumber);
        });
    });
}

// Inicializar marcadores de progresso
function initProgressMarkers() {
    const markers = document.querySelectorAll('.progress-marker');
    
    markers.forEach(marker => {
        marker.addEventListener('click', function() {
            const weekNumber = parseInt(this.getAttribute('data-week'));
            
            // Determinar a fase baseada na semana
            let phaseId;
            if (weekNumber <= 4) {
                phaseId = 'explore';
            } else if (weekNumber <= 8) {
                phaseId = 'implement';
            } else {
                phaseId = 'expand';
            }
            
            // Ativar a fase correspondente
            const phase = document.querySelector(`.roadmap-phase[data-phase="${phaseId}"]`);
            if (phase) {
                phase.click();
            }
            
            // Ativar a tab da semana correspondente
            const weekTab = document.querySelector(`.phase-content.active .week-tab[data-week="${weekNumber}"]`);
            if (weekTab) {
                weekTab.click();
            }
        });
    });
}

// Atualizar marcadores de progresso com base na fase selecionada
function updateProgressMarkers(phaseId) {
    const markers = document.querySelectorAll('.progress-marker');
    
    markers.forEach(marker => {
        marker.classList.remove('active');
        
        const weekNumber = parseInt(marker.getAttribute('data-week'));
        
        // Definir marcadores ativos com base na fase
        if (phaseId === 'explore' && weekNumber <= 4) {
            marker.classList.add('active');
        } else if (phaseId === 'implement' && weekNumber > 4 && weekNumber <= 8) {
            marker.classList.add('active');
        } else if (phaseId === 'expand' && weekNumber > 8) {
            marker.classList.add('active');
        }
    });
}

// Atualizar marcador de progresso ativo para a semana específica
function updateActiveProgressMarker(weekNumber) {
    const markers = document.querySelectorAll('.progress-marker');
    
    markers.forEach(marker => {
        marker.classList.remove('active');
        
        if (marker.getAttribute('data-week') === weekNumber) {
            marker.classList.add('active');
        }
    });
}

// Atualizar progresso do roadmap com base nos checkboxes marcados
function updateRoadmapProgress() {
    const allCheckboxes = document.querySelectorAll('.activity-check input[type="checkbox"]');
    const checkedCount = Array.from(allCheckboxes).filter(checkbox => checkbox.checked).length;
    const totalCount = allCheckboxes.length;
    
    // Calcular porcentagem de conclusão
    const percentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
    
    // Atualizar exibição de progresso
    document.querySelector('.progress-fill').style.width = `${percentage}%`;
    document.getElementById('roadmapProgressPercentage').textContent = `${percentage}%`;
    
    // Atualizar marcadores de semana concluídos
    updateCompletedWeekMarkers();
    
    // Se completou mais de 50%, marcar progresso
    if (percentage >= 50) {
        markProgress('plano-90-dias');
    }
}

// Atualizar marcadores de semana concluídos
function updateCompletedWeekMarkers() {
    // Para cada semana, verificar se todas as atividades estão concluídas
    for (let weekNum = 1; weekNum <= 12; weekNum++) {
        const weekDetail = document.getElementById(`week-${weekNum}`);
        if (weekDetail) {
            const checkboxes = weekDetail.querySelectorAll('input[type="checkbox"]');
            if (checkboxes.length > 0) {
                const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
                
                if (allChecked) {
                    const marker = document.querySelector(`.progress-marker[data-week="${weekNum}"]`);
                    if (marker) {
                        marker.classList.add('completed');
                    }
                }
            }
        }
    }
}

// Configurar botões do roadmap
function setupRoadmapButtons() {
    const downloadButton = document.getElementById('downloadRoadmap');
    const customizeButton = document.getElementById('customizeRoadmap');
    const startJourneyButton = document.getElementById('startJourney');
    const scheduleRemindersButton = document.getElementById('scheduleReminders');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            alert('Em uma implementação real, este botão geraria um PDF com o plano de 90 dias completo, personalizado com suas escolhas e progresso atual.');
        });
    }
    
    if (customizeButton) {
        customizeButton.addEventListener('click', function() {
            const sector = prompt('Qual é o seu setor de atuação?', 'Varejo');
            
            if (sector) {
                alert(`Em uma implementação real, este processo personalizaria o plano de 90 dias especificamente para o setor "${sector}", com exemplos e atividades mais relevantes para sua área.`);
            }
        });
    }
    
    if (startJourneyButton) {
        startJourneyButton.addEventListener('click', function() {
            const today = new Date();
            const dayOne = new Date(today);
            const lastDay = new Date(today);
            lastDay.setDate(lastDay.getDate() + 90);
            
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedStartDate = dayOne.toLocaleDateString('pt-BR', options);
            const formattedEndDate = lastDay.toLocaleDateString('pt-BR', options);
            
            if (confirm(`Você está prestes a iniciar sua jornada de 90 dias!\n\nData de início: ${formattedStartDate}\nData de conclusão: ${formattedEndDate}\\n\nDeseja confirmar?`)) {
                // Salvar as datas no localStorage
                localStorage.setItem('journey_start_date', today.toISOString());
                localStorage.setItem('journey_end_date', lastDay.toISOString());
                
                // Mostrar mensagem de confirmação
                alert(`Jornada iniciada com sucesso!\n\nRecomendamos que você dedique 2-3 horas por semana para implementar as atividades do plano.\n\nBoa sorte!`);
                
                // Rolar até o topo do plano para começar
                document.querySelector('.roadmap-phase[data-phase="explore"]').click();
            }
        });
    }
    
    if (scheduleRemindersButton) {
        scheduleRemindersButton.addEventListener('click', function() {
            const email = prompt('Digite seu e-mail para receber lembretes semanais sobre seu plano de implementação:', '');
            
            if (email && validateEmail(email)) {
                alert(`Em uma implementação real, você receberia lembretes semanais no e-mail ${email} com dicas e atividades para a semana, ajudando você a se manter no caminho certo.`);
            } else if (email) {
                alert('Por favor, forneça um endereço de e-mail válido.');
            }
        });
    }
}

// Validar formato de e-mail

// Mostrar/ocultar recursos de atividade
function toggleActivityResource(resourceId) {
    const resource = document.getElementById(resourceId);
    if (resource) {
        resource.classList.toggle('hidden');
    }
}

// Calcular dias restantes na jornada
function calculateRemainingDays() {
    const startDateStr = localStorage.getItem('journey_start_date');
    const endDateStr = localStorage.getItem('journey_end_date');
    
    if (startDateStr && endDateStr) {
        const today = new Date();
        const endDate = new Date(endDateStr);
        
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            return diffDays;
        }
    }
    
    return null;
}

// Verificar se há uma jornada em andamento e mostrar status
function checkJourneyStatus() {
    const remainingDays = calculateRemainingDays();
    
    if (remainingDays !== null) {
        // Criar uma notificação de status da jornada
        const notification = document.createElement('div');
        notification.className = 'journey-status-notification';
        
        notification.innerHTML = `
            <div class="notification-icon">⏱️</div>
            <div class="notification-content">
                <h4>Jornada em andamento</h4>
                <p>Restam <strong>${remainingDays} dias</strong> para concluir seu plano de 90 dias.</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        // Adicionar ao documento após carregar a página
        document.body.appendChild(notification);
        
        // Remover após 10 segundos
        setTimeout(() => {
            notification.classList.add('hiding');
            setTimeout(() => notification.remove(), 500);
        }, 10000);
    }
}

// Verificar status da jornada ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkJourneyStatus, 2000);
});

// Funcionalidades para a seção de Aplicações Práticas por Setor

document.addEventListener('DOMContentLoaded', function() {
    initFilterButtons();
    initDetailsToggle();
    initSetorTabs();
    initMatrizDecisao();
});

// Inicializar botões de filtro
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const aplicacaoCards = document.querySelectorAll('.aplicacao-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Obter categoria selecionada
            const filterValue = this.getAttribute('data-filter');
            
            // Filtrar cards
            aplicacaoCards.forEach(card => {
                if (filterValue === 'todos' || card.getAttribute('data-categoria') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Inicializar toggle de detalhes
function initDetailsToggle() {
    // Botões para exibir detalhes
    const verMaisBotoes = document.querySelectorAll('.ver-mais');
    
    verMaisBotoes.forEach(botao => {
        botao.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const detalhes = document.getElementById(targetId);
            
            if (detalhes) {
                detalhes.classList.remove('hidden');
                this.parentElement.classList.add('hidden');
            }
            
            // Marcar progresso quando o usuário vê detalhes
            markProgress('aplicacoes');
        });
    });
    
    // Botões para fechar detalhes
    const fecharBotoes = document.querySelectorAll('.fechar-detalhes');
    
    fecharBotoes.forEach(botao => {
        botao.addEventListener('click', function() {
            const cardDetails = this.closest('.card-details');
            if (cardDetails) {
                cardDetails.classList.add('hidden');
                
                // Mostrar novamente o preview
                const previewElement = cardDetails.previousElementSibling;
                if (previewElement && previewElement.classList.contains('card-preview')) {
                    previewElement.classList.remove('hidden');
                }
            }
        });
    });
}

// Inicializar tabs de setores
function initSetorTabs() {
    const setorTabs = document.querySelectorAll('.setor-tab');
    
    setorTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover classe active de todas as tabs
            setorTabs.forEach(t => {
                t.classList.remove('active');
            });
            
            // Adicionar classe active à tab clicada
            this.classList.add('active');
            
            // Obter setor selecionado
            const setorValue = this.getAttribute('data-setor');
            
            // Mostrar conteúdo correspondente
            const setorContents = document.querySelectorAll('.setor-content');
            
            setorContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const activeContent = document.getElementById(`${setorValue}-content`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

// Inicializar matriz de decisão
function initMatrizDecisao() {
    const calcularBtn = document.getElementById('calcularMatriz');
    const resetBtn = document.getElementById('resetMatriz');
    const ratingSelects = document.querySelectorAll('.rating-select');
    
    // Atualizar pontuações quando valores mudam
    ratingSelects.forEach(select => {
        select.addEventListener('change', function() {
            updateMatrizScores();
        });
    });
    
    // Calcular priorização ao clicar no botão
    if (calcularBtn) {
        calcularBtn.addEventListener('click', function() {
            calculatePrioritization();
        });
    }
    
    // Resetar valores ao clicar no botão
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetMatriz();
        });
    }
    
    // Calcular pontuações iniciais
    updateMatrizScores();
}

// Atualizar pontuações na matriz
function updateMatrizScores() {
    // Coletar todas as aplicações
    const aplicacoes = ['chatbot', 'personalizacao'];
    // Adicione mais aplicações conforme necessário
    
    // Atualizar pontuação para cada aplicação
    aplicacoes.forEach(aplicacao => {
        let totalScore = 0;
        
        // Obter valores de cada critério
        const facilidade = parseInt(document.querySelector(`.rating-select[data-aplicacao="${aplicacao}"][data-criterio="facilidade"]`).value) || 0;
        const impacto = parseInt(document.querySelector(`.rating-select[data-aplicacao="${aplicacao}"][data-criterio="impacto"]`).value) || 0;
        const custo = parseInt(document.querySelector(`.rating-select[data-aplicacao="${aplicacao}"][data-criterio="custo"]`).value) || 0;
        const tempo = parseInt(document.querySelector(`.rating-select[data-aplicacao="${aplicacao}"][data-criterio="tempo"]`).value) || 0;
        
        // Calcular pontuação total (ponderada)
        totalScore = facilidade + (impacto * 1.5) + custo + tempo;
        
        // Atualizar elemento de pontuação
        const scoreElement = document.getElementById(`${aplicacao}-score`);
        if (scoreElement) {
            scoreElement.textContent = Math.round(totalScore);
        }
    });
}

// Calcular priorização final
function calculatePrioritization() {
    // Coletar todas as aplicações e suas pontuações
    const aplicacoes = [
        { id: 'chatbot', nome: 'Chatbot e Assistentes Virtuais' },
        { id: 'personalizacao', nome: 'Personalização de Conteúdo' }
        // Adicione mais aplicações conforme necessário
    ];
    
    // Obter pontuações
    aplicacoes.forEach(app => {
        const scoreElement = document.getElementById(`${app.id}-score`);
        if (scoreElement) {
            app.score = parseInt(scoreElement.textContent) || 0;
        } else {
            app.score = 0;
        }
    });
    
    // Ordenar por pontuação (maior para menor)
    aplicacoes.sort((a, b) => b.score - a.score);
    
    // Mostrar resultados
    const resultadoContainer = document.getElementById('matriz-resultado');
    const resultadoContent = resultadoContainer.querySelector('.resultado-content');
    
    if (resultadoContainer && resultadoContent) {
        let resultadoHTML = '<p>Com base na sua avaliação, recomendamos a seguinte ordem de implementação:</p>';
        resultadoHTML += '<ol class="resultado-lista">';
        
        aplicacoes.forEach((app, index) => {
            resultadoHTML += `
                <li>
                    <div class="resultado-item">
                        <div class="resultado-info">
                            <span class="resultado-numero">${index + 1}</span>
                            <span class="resultado-nome">${app.nome}</span>
                        </div>
                        <div class="resultado-score">${app.score} pontos</div>
                    </div>
                </li>
            `;
        });
        
        resultadoHTML += '</ol>';
        
        // Adicionar recomendação personalizada
        const topApp = aplicacoes[0];
        let recomendacao = '';
        
        if (topApp.id === 'chatbot') {
            recomendacao = 'Os Chatbots são um excelente ponto de partida pois oferecem resultados rápidos com implementação relativamente simples. Comece com um escopo limitado, como respostas às 10-15 perguntas mais frequentes.';
        } else if (topApp.id === 'personalizacao') {
            recomendacao = 'A personalização de conteúdo pode trazer alto impacto no engajamento e conversão. Comece segmentando seus clientes em 3-5 grupos e criando conteúdos específicos para cada um.';
        }
        
        if (recomendacao) {
            resultadoHTML += `
                <div class="recomendacao-final">
                    <h5>Próximos passos:</h5>
                    <p>${recomendacao}</p>
                    <p>Consulte a seção "Plano de 90 dias" para um roadmap detalhado de implementação.</p>
                </div>
            `;
        }
        
        resultadoContent.innerHTML = resultadoHTML;
        resultadoContainer.classList.remove('hidden');
        
        // Rolar até o resultado
        resultadoContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Marcar progresso
        markProgress('aplicacoes');
    }
}

// Resetar valores da matriz
function resetMatriz() {
    const ratingSelects = document.querySelectorAll('.rating-select');
    
    // Definir valores padrão
    ratingSelects.forEach(select => {
        select.selectedIndex = 2; // Definir para valor médio (3)
    });
    
    // Atualizar pontuações
    updateMatrizScores();
    
    // Esconder resultado
    const resultadoContainer = document.getElementById('matriz-resultado');
    if (resultadoContainer) {
        resultadoContainer.classList.add('hidden');
    }
}

// JavaScript para a seção Como Começar reformulada

document.addEventListener('DOMContentLoaded', function() {
    initJourneySteps();
    initOpportunityScanner();
    initToolFinder();
    initRoiCalculator();
    initLaunchChecklist();
    setupGetStartedActions();
});

// Inicializar etapas da jornada
function initJourneySteps() {
    const journeySteps = document.querySelectorAll('.journey-step');
    const stepContents = document.querySelectorAll('.step-content');
    
    journeySteps.forEach(step => {
        step.addEventListener('click', function() {
            // Remover classe 'active' de todas as etapas
            journeySteps.forEach(s => s.classList.remove('active'));
            
            // Adicionar classe 'active' à etapa clicada
            this.classList.add('active');
            
            // Mostrar conteúdo correspondente
            const targetStep = this.getAttribute('data-step');
            stepContents.forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(`${targetStep}-content`).classList.add('active');
            
            // Atualizar barra de progresso
            updateProgressBar(targetStep);
            
            // Marcar progresso
            markProgress('como-comecar');
        });
    });
    
    // Botões de próximo e anterior
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetStep = this.getAttribute('data-target');
            navigateToStep(targetStep);
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetStep = this.getAttribute('data-target');
            navigateToStep(targetStep);
        });
    });
}

// Navegar para uma etapa específica
function navigateToStep(stepId) {
    const step = document.querySelector(`.journey-step[data-step="${stepId}"]`);
    if (step) {
        step.click();
        
        // Rolar para o topo da seção
        const stepContent = document.getElementById(`${stepId}-content`);
        if (stepContent) {
            stepContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Atualizar barra de progresso
function updateProgressBar(currentStep) {
    const steps = ['discover', 'select', 'plan', 'implement'];
    const progressFill = document.querySelector('.progress-fill');
    
    if (progressFill) {
        const currentIndex = steps.indexOf(currentStep);
        const progressPercentage = ((currentIndex + 1) / steps.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
}

// Scanner de Oportunidades
function initOpportunityScanner() {
    const analyzeButton = document.getElementById('analyzeOpportunities');
    
    if (analyzeButton) {
        analyzeButton.addEventListener('click', analyzeOpportunities);
    }
    
    // Atualizar valores ao mover sliders
    const sliders = document.querySelectorAll('.criteria-slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            // Opcional: Atualizar algum feedback visual enquanto o usuário move o slider
        });
    });
}

// Analisar oportunidades com base nos critérios
function analyzeOpportunities() {
    // Coletar valores dos sliders por área
    const areas = {
        atendimento: {
            volume: getSliderValue('atendimento', 'volume'),
            tempo: getSliderValue('atendimento', 'tempo'),
            dados: getSliderValue('atendimento', 'dados')
        },
        admin: {
            volume: getSliderValue('admin', 'volume'),
            tempo: getSliderValue('admin', 'tempo'),
            dados: getSliderValue('admin', 'dados')
        },
        marketing: {
            volume: getSliderValue('marketing', 'volume'),
            repeticao: getSliderValue('marketing', 'repeticao'),
            dados: getSliderValue('marketing', 'dados')
        }
    };
    
    // Calcular pontuação para cada área
    const scores = {
        atendimento: calculateAreaScore(areas.atendimento),
        admin: calculateAreaScore(areas.admin),
        marketing: calculateAreaScore(areas.marketing)
    };
    
    // Ordenar áreas por pontuação
    const rankedAreas = [
        { name: 'Atendimento ao Cliente', id: 'atendimento', score: scores.atendimento },
        { name: 'Processos Administrativos', id: 'admin', score: scores.admin },
        { name: 'Marketing e Vendas', id: 'marketing', score: scores.marketing }
    ].sort((a, b) => b.score - a.score);
    
    // Mostrar resultados
    displayOpportunityResults(rankedAreas);
}

// Obter valor de um slider específico
function getSliderValue(area, criteria) {
    const slider = document.querySelector(`.criteria-slider[data-area="${area}"][data-criteria="${criteria}"]`);
    return slider ? parseInt(slider.value) : 3; // Valor padrão: 3 (médio)
}

// Calcular pontuação para uma área
function calculateAreaScore(areaData) {
    // Soma simples de todos os critérios
    let score = 0;
    for (const criterion in areaData) {
        score += areaData[criterion];
    }
    return score;
}

// Exibir resultados da análise de oportunidades
function displayOpportunityResults(rankedAreas) {
    const resultsContainer = document.getElementById('opportunityResults');
    const resultsAreasDiv = document.querySelector('.results-areas');
    const recommendationText = document.getElementById('recommendationText');
    
    if (resultsContainer && resultsAreasDiv && recommendationText) {
        // Limpar resultados anteriores
        resultsAreasDiv.innerHTML = '';
        
        // Adicionar áreas ranqueadas
        rankedAreas.forEach((area, index) => {
            const scorePercentage = (area.score / 15) * 100; // 15 é a pontuação máxima (3 critérios x 5 pontos)
            
            let opportunityLevel;
            if (scorePercentage >= 80) {
                opportunityLevel = 'Alto potencial';
            } else if (scorePercentage >= 60) {
                opportunityLevel = 'Bom potencial';
            } else {
                opportunityLevel = 'Potencial moderado';
            }
            
            resultsAreasDiv.innerHTML += `
                <div class="result-area">
                    <div class="area-header">
                        <div class="area-rank">${index + 1}</div>
                        <div class="area-name">${area.name}</div>
                        <div class="area-opportunity">${opportunityLevel}</div>
                    </div>
                    <div class="area-score-bar">
                        <div class="score-fill" style="width: ${scorePercentage}%"></div>
                    </div>
                </div>
            `;
        });
        
        // Gerar recomendação baseada na área com maior pontuação
        const topArea = rankedAreas[0];
        let recommendation = '';
        
        switch (topArea.id) {
            case 'atendimento':
                recommendation = `Sua maior oportunidade está na área de <strong>Atendimento ao Cliente</strong>. Considere implementar um chatbot ou assistente virtual para automatizar respostas às perguntas mais frequentes. Comece mapeando as 20 perguntas mais comuns e suas respostas padronizadas.`;
                break;
            case 'admin':
                recommendation = `Sua maior oportunidade está na área de <strong>Processos Administrativos</strong>. Considere automatizar entrada de dados e processamento de documentos com ferramentas de OCR e automação de fluxo de trabalho. Comece identificando os processos que consomem mais tempo.`;
                break;
            case 'marketing':
                recommendation = `Sua maior oportunidade está na área de <strong>Marketing e Vendas</strong>. Considere implementar IA para geração de conteúdo e personalização de comunicações. Comece criando templates para seus tipos mais comuns de conteúdo e automatizando sua produção.`;
                break;
        }
        
        recommendationText.innerHTML = recommendation;
        
        // Mostrar resultados
        resultsContainer.classList.remove('hidden');
        
        // Rolar para os resultados
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Marcar progresso
        markProgress('como-comecar');
    }
}

// Ferramenta de busca de ferramentas
function initToolFinder() {
    const findButton = document.getElementById('findTools');
    
    if (findButton) {
        findButton.addEventListener('click', findTools);
    }
}

// Encontrar ferramentas com base nos filtros
function findTools() {
    const applicationType = document.getElementById('applicationTypeFilter').value;
    const budget = document.getElementById('budgetFilter').value;
    const complexity = document.getElementById('complexityFilter').value;
    
    // Simulação de banco de dados de ferramentas
    const toolsDatabase = [
        {
            name: 'ChatGPT',
            description: 'IA generativa para criação de conteúdo, brainstorming e assistência em diversas tarefas',
            type: 'conteudo',
            budget: ['gratuito', 'baixo'],
            complexity: 'iniciante',
            price: 'Gratuito / $20/mês (Plus)',
            website: '#',
            logoUrl: '#'
        },
        {
            name: 'ManyChat',
            description: 'Plataforma para criar chatbots para WhatsApp, Instagram e Facebook sem programação',
            type: 'chatbot',
            budget: ['gratuito', 'baixo'],
            complexity: 'iniciante',
            price: 'Gratuito / $15/mês',
            website: '#',
            logoUrl: '#'
        },
        {
            name: 'Make (Integromat)',
            description: 'Plataforma visual para automatizar processos conectando diferentes aplicativos',
            type: 'automacao',
            budget: ['gratuito', 'medio'],
            complexity: 'intermediario',
            price: 'Gratuito / $16/mês',
            website: '#',
            logoUrl: '#'
        },
        {
            name: 'Zapier',
            description: 'Conecta aplicativos e automatiza fluxos de trabalho sem programação',
            type: 'automacao',
            budget: ['gratuito', 'medio'],
            complexity: 'iniciante',
            price: 'Gratuito / $20/mês',
            website: '#',
            logoUrl: '#'
        },
        {
            name: 'Jasper.ai',
            description: 'IA avançada para criação de conteúdo de marketing de alta qualidade',
            type: 'conteudo',
            budget: ['medio', 'alto'],
            complexity: 'iniciante',
            price: 'A partir de $39/mês',
            website: '#',
            logoUrl: '#'
        },
        {
            name: 'HubSpot',
            description: 'CRM com recursos de IA para marketing, vendas e atendimento ao cliente',
            type: 'personalização',
            budget: ['medio', 'alto'],
            complexity: 'intermediario',
            price: 'Gratuito / A partir de $45/mês',
            website: '#',
            logoUrl: '#'
        },
        {
            name: 'DialogFlow',
            description: 'Plataforma do Google para criar chatbots avançados com processamento de linguagem natural',
            type: 'chatbot',
            budget: ['gratuito', 'alto'],
            complexity: 'intermediario',
            price: 'Gratuito / Baseado em uso',
            website: '#',
            logoUrl: '#'
        },
        {
            name: 'MonkeyLearn',
            description: 'Plataforma para análise de texto e classificação de dados com IA',
            type: 'analise',
            budget: ['medio', 'alto'],
            complexity: 'avancado',
            price: 'A partir de $299/mês',
            website: '#',
            logoUrl: '#'
        }
    ];
    
    // Filtrar ferramentas
    let filteredTools = toolsDatabase;
    
    if (applicationType !== 'todos') {
        filteredTools = filteredTools.filter(tool => tool.type === applicationType);
    }
    
    if (budget !== 'todos') {
        filteredTools = filteredTools.filter(tool => tool.budget.includes(budget));
    }
    
    if (complexity !== 'todos') {
        filteredTools = filteredTools.filter(tool => tool.complexity === complexity);
    }
    
    // Exibir resultados
    displayToolResults(filteredTools);
}

// Exibir resultados da busca de ferramentas
function displayToolResults(tools) {
    const resultsContainer = document.getElementById('toolResults');
    const toolsGrid = document.getElementById('toolsGrid');
    
    if (resultsContainer && toolsGrid) {
        // Limpar resultados anteriores
        toolsGrid.innerHTML = '';
        
        if (tools.length === 0) {
            // Sem resultados
            toolsGrid.innerHTML = `
                <div class="no-results">
                    <p>Nenhuma ferramenta encontrada com esses critérios. Tente ajustar os filtros.</p>
                </div>
            `;
        } else {
            // Adicionar ferramentas encontradas
            tools.forEach(tool => {
                let complexityLabel = '';
                let complexityClass = '';
                
                switch (tool.complexity) {
                    case 'iniciante':
                        complexityLabel = 'Iniciante';
                        complexityClass = 'easy';
                        break;
                    case 'intermediario':
                        complexityLabel = 'Intermediário';
                        complexityClass = 'medium';
                        break;
                    case 'avancado':
                        complexityLabel = 'Avançado';
                        complexityClass = 'hard';
                        break;
                }
                
                toolsGrid.innerHTML += `
                    <div class="tool-card">
                        <div class="tool-header">
                            <h5>${tool.name}</h5>
                            <span class="price-tag">${tool.price}</span>
                        </div>
                        <p>${tool.description}</p>
                        <div class="tool-footer">
                            <span class="difficulty-level ${complexityClass}">${complexityLabel}</span>
                            <a href="${tool.website}" class="tool-link" target="_blank">Saiba mais</a>
                        </div>
                    </div>
                `;
            });
        }
        
        // Mostrar resultados
        resultsContainer.classList.remove('hidden');
        
        // Marcar progresso
        markProgress('como-comecar');
    }
}

// Calculadora de ROI
function initRoiCalculator() {
    const calculateButton = document.getElementById('calculateRoi');
    
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateRoi);
    }
}

// Calcular ROI
function calculateRoi() {
    // Obter valores dos campos
    const toolCost = parseFloat(document.getElementById('toolCost').value) || 0;
    const implementationHours = parseFloat(document.getElementById('implementationHours').value) || 0;
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;
    const maintenanceHours = parseFloat(document.getElementById('maintenanceHours').value) || 0;
    const savedHours = parseFloat(document.getElementById('savedHours').value) || 0;
    const errorsAvoided = parseFloat(document.getElementById('errorsAvoided').value) || 0;
    const errorCost = parseFloat(document.getElementById('errorCost').value) || 0;
    const additionalRevenue = parseFloat(document.getElementById('additionalRevenue').value) || 0;
    
    // Calcular custos
    const initialCost = implementationHours * hourlyRate;
    const monthlyCost = toolCost + (maintenanceHours * hourlyRate);
    const yearCost = initialCost + (monthlyCost * 12);
    
    // Calcular benefícios
    const timeSavings = savedHours * hourlyRate;
    const errorSavings = errorsAvoided * errorCost;
    const monthlyBenefit = timeSavings + errorSavings + additionalRevenue;
    const yearBenefit = monthlyBenefit * 12;
    
    // Calcular ROI e payback
    const roi = yearCost > 0 ? ((yearBenefit - yearCost) / yearCost) * 100 : 0;
    
    let payback = 0;
    if (monthlyBenefit > monthlyCost) {
        const monthlyNetBenefit = monthlyBenefit - monthlyCost;
        payback = monthlyNetBenefit > 0 ? initialCost / monthlyNetBenefit : 0;
    } else {
        payback = Infinity;
    }
    
    // Atualizar resultados
    document.getElementById('roiValue').textContent = `${Math.round(roi)}%`;
    document.getElementById('paybackValue').textContent = payback === Infinity ? 'N/A' : 
        payback > 12 ? 'Mais de 1 ano' : 
        payback.toFixed(1) + ' meses';
    document.getElementById('monthlyBenefitValue').textContent = formatCurrency(monthlyBenefit);
    
    document.getElementById('initialCostValue').textContent = formatCurrency(initialCost);
    document.getElementById('monthlyCostValue').textContent = formatCurrency(monthlyCost);
    document.getElementById('yearCostValue').textContent = formatCurrency(yearCost);
    
    document.getElementById('timeSavingsValue').textContent = formatCurrency(timeSavings);
    document.getElementById('errorSavingsValue').textContent = formatCurrency(errorSavings);
    document.getElementById('revenueValue').textContent = formatCurrency(additionalRevenue);
    document.getElementById('yearBenefitValue').textContent = formatCurrency(yearBenefit);
    
    // Gerar interpretação
    let interpretation = '';
    if (roi > 200) {
        interpretation = `
            <p><strong>ROI Excelente!</strong> Com um retorno de ${Math.round(roi)}% no primeiro ano, este projeto tem potencial de impacto muito significativo para o seu negócio.</p>
            <p>O tempo de retorno estimado de ${payback.toFixed(1)} meses é extremamente favorável, indicando que você recuperará seu investimento inicial rapidamente.</p>
            <p><strong>Recomendação:</strong> Este projeto deve ser priorizado e implementado o quanto antes.</p>
        `;
    } else if (roi > 100) {
        interpretation = `
            <p><strong>ROI Muito Bom!</strong> Com um retorno de ${Math.round(roi)}% no primeiro ano, este projeto representa um investimento sólido para o seu negócio.</p>
            <p>O tempo de retorno estimado de ${payback.toFixed(1)} meses indica que você recuperará seu investimento em menos de um ano.</p>
            <p><strong>Recomendação:</strong> Este projeto merece ser implementado assim que possível.</p>
        `;
    } else if (roi > 50) {
        interpretation = `
            <p><strong>ROI Positivo.</strong> Com um retorno de ${Math.round(roi)}% no primeiro ano, este projeto representa um bom investimento para o seu negócio.</p>
            <p>O tempo de retorno estimado de ${payback.toFixed(1)} meses indica que você recuperará seu investimento dentro de um prazo razoável.</p>
            <p><strong>Recomendação:</strong> Este projeto é viável e deve ser considerado para implementação.</p>
        `;
    } else if (roi > 0) {
        interpretation = `
            <p><strong>ROI Moderado.</strong> Com um retorno de ${Math.round(roi)}% no primeiro ano, este projeto oferece um retorno positivo, mas modesto.</p>
            <p>O tempo de retorno estimado de ${payback.toFixed(1)} meses indica que você eventualmente recuperará seu investimento, mas pode levar algum tempo.</p>
            <p><strong>Recomendação:</strong> Considere este projeto, mas verifique se há oportunidades para melhorar o ROI reduzindo custos ou aumentando benefícios.</p>
        `;
    } else {
        interpretation = `
            <p><strong>ROI Negativo ou Neutro.</strong> Com um retorno calculado de ${Math.round(roi)}%, este projeto não parece oferecer benefício financeiro no primeiro ano.</p>
            <p><strong>Recomendação:</strong> Reavalie os custos e benefícios estimados. Considere alternativas com melhor retorno ou benefícios a longo prazo não capturados neste cálculo.</p>
        `;
    }
    
    document.getElementById('roiInterpretation').innerHTML = interpretation;
    
    // Mostrar resultados
    document.getElementById('roiResults').classList.remove('hidden');
    
    // Rolar para os resultados
    document.getElementById('roiResults').scrollIntoView({ behavior: 'smooth' });
    
    // Marcar progresso
    markProgress('como-comecar');
}

// Formatar valores monetários
function formatCurrency(value) {
    return `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

// Lista de verificação de lançamento
function initLaunchChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    
    if (checkboxes.length > 0) {
        // Adicionar evento de change a cada checkbox
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateChecklistProgress);
        });
        
        // Inicializar progresso
        updateChecklistProgress();
    }
}

// Atualizar progresso da lista de verificação
function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const totalItems = checkboxes.length;
    let checkedItems = 0;
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkedItems++;
        }
    });
    
    const progressPercentage = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;
    
    // Atualizar barra de progresso
    const progressBar = document.getElementById('checklistProgress');
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }
    
    // Atualizar texto de porcentagem
    const percentageText = document.getElementById('checklistPercentage');
    if (percentageText) {
        percentageText.textContent = `${Math.round(progressPercentage)}%`;
    }
    
    // Marcar progresso
    if (progressPercentage > 0) {
        markProgress('como-comecar');
    }
}

// Configurar ações da seção "Começar"
function setupGetStartedActions() {
    // Botão para iniciar jornada
    const startJourneyButton = document.getElementById('startJourney');
    if (startJourneyButton) {
        startJourneyButton.addEventListener('click', function() {
            // Rolar para o topo da seção
            const section = document.getElementById('como-comecar');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Navegar para a primeira etapa
            navigateToStep('discover');
        });
    }
    
    // Botão para revisar guia
    const reviewGuideButton = document.getElementById('reviewGuide');
    if (reviewGuideButton) {
        reviewGuideButton.addEventListener('click', function() {
            // Criar modal ou redirecionar para página com o guia
            alert('Funcionalidade de revisão do guia em desenvolvimento.');
        });
    }
    
    // Botão para ir para a próxima seção
    const nextSectionButton = document.getElementById('nextSection');
    if (nextSectionButton) {
        nextSectionButton.addEventListener('click', function() {
            // Rolar para a próxima seção (ajuste conforme necessário)
            const nextSection = document.getElementById('aplicacoes-praticas');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                alert('Próxima seção em desenvolvimento.');
            }
        });
    }
    
    // Botões para download de templates
    const downloadButtons = document.querySelectorAll('.btn-download, .btn-primary[data-action="download"]');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resourceType = this.getAttribute('data-resource') || 'template';
            const resourceFormat = this.getAttribute('data-format') || 'docx';
            
            // Simular download (substitua por lógica real)
            alert(`Download de ${resourceType} em formato ${resourceFormat} iniciado. (Simulação)`);
        });
    });
}

// Função para marcar progresso do usuário
function markProgress(sectionId) {
    // Esta função pode ser expandida para salvar o progresso do usuário
    // Por exemplo, usando localStorage ou enviando para o servidor
    
    // Exemplo simples usando localStorage
    if (typeof localStorage !== 'undefined') {
        const now = new Date().toISOString();
        localStorage.setItem(`progress_${sectionId}`, now);
    }
}

// Função de pesquisa em tempo real para ferramentas

// Inicializar todas as funcionalidades de pesquisa

// Adicionar evento para quando a DOM estiver completamente carregada
document.addEventListener('DOMContentLoaded', function() {
    initJourneySteps();
    initOpportunityScanner();
    initToolFinder();
    initRoiCalculator();
    initLaunchChecklist();
    setupGetStartedActions();
    initSearchFeatures();
});

// Adicionar evento de resize para ajustes responsivos
window.addEventListener('resize', function() {
    // Ajustar layout responsivo se necessário
});

// Inicializar tooltips se estiver usando bibliotecas como Bootstrap

// Exportar funções para uso global
window.navigateToStep = navigateToStep;
window.analyzeOpportunities = analyzeOpportunities;
window.calculateRoi = calculateRoi;
window.findTools = findTools;


// Função para inicializar a seção de Considerações Éticas e Legais
document.addEventListener('DOMContentLoaded', function() {
    initEticaLegalSection();
});

function initEticaLegalSection() {
    // Configurar os checkboxes da seção LGPD
    const lgpdCheckboxes = document.querySelectorAll('#etica-legal input[type="checkbox"]');
    
    // Adicionar evento change para cada checkbox
    lgpdCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateLgpdProgress();
            updateChecklistVisualFeedback(this);
        });
    });
    
    // Configurar o botão de marcar como concluído
    const completeButton = document.querySelector('#etica-legal .btn-primary');
    if (completeButton) {
        completeButton.addEventListener('click', function() {
            markProgress('etica-legal');
            showComplianceStatus();
        });
    }
}

// Função para atualizar o progresso dos checklists de LGPD
function updateLgpdProgress() {
    const lgpdCheckboxes = document.querySelectorAll('#etica-legal .checklist input[type="checkbox"]');
    const totalCheckboxes = lgpdCheckboxes.length;
    let checkedCount = 0;
    
    lgpdCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkedCount++;
        }
    });
    
    // Calcular porcentagem de conformidade
    const percentComplete = Math.round((checkedCount / totalCheckboxes) * 100);
    
    // Atualizar barra de progresso visual, se existir
    const progressBar = document.querySelector('#etica-legal .progress-fill');
    if (progressBar) {
        progressBar.style.width = percentComplete + '%';
    }
    
    // Se todos os checkboxes estiverem marcados, mostrar mensagem de conformidade
    if (checkedCount === totalCheckboxes) {
        showComplianceStatus(true);
    }
    
    // Atualizar contadores de progresso geral do e-book
    updateProgress();
}

// Função para atualizar o feedback visual dos checkboxes da seção de ética
function updateEticaChecklistFeedback(checkbox) {
    const checklistItem = checkbox.closest('.checklist-item');
    
    if (checklistItem) {
        const checklistTip = checklistItem.querySelector('.checklist-tip');
        
        if (checkbox.checked) {
            checklistItem.style.borderLeft = '4px solid #10b981';
            if (checklistTip) {
                checklistTip.style.color = '#065f46';
                checklistTip.style.fontWeight = '500';
            }
        } else {
            checklistItem.style.borderLeft = '4px solid #f59e0b';
            if (checklistTip) {
                checklistTip.style.color = '#6b7280';
                checklistTip.style.fontWeight = 'normal';
            }
        }
    }
}

// Função para mostrar status de conformidade
function showComplianceStatus(isFullyCompliant = false) {
    // Verificar se o elemento de status já existe para não criar duplicados
    let statusElement = document.getElementById('compliance-status');
    
    if (!statusElement) {
        // Criar elemento para mostrar status de conformidade
        statusElement = document.createElement('div');
        statusElement.id = 'compliance-status';
        statusElement.className = isFullyCompliant ? 
            'mt-4 p-3 border rounded bg-green-100 text-center' : 
            'mt-4 p-3 border rounded bg-yellow-100 text-center';
        
        // Inserir após o último accordion na seção
        const eticaLegalSection = document.getElementById('etica-legal');
        const lastAccordion = eticaLegalSection.querySelector('.accordion');
        
        if (lastAccordion) {
            lastAccordion.insertAdjacentElement('afterend', statusElement);
        }
    }
    
    // Atualizar conteúdo do status
    if (isFullyCompliant) {
        statusElement.className = 'mt-4 p-3 border rounded bg-green-100 text-center';
        statusElement.innerHTML = `
            <h4 class="font-medium text-green-800 mb-2">✅ Parabéns! Sua empresa está em conformidade com as diretrizes éticas e legais.</h4>
            <p>Continuar mantendo estas práticas ajudará a garantir uma implementação de IA responsável e em conformidade com a LGPD.</p>
            <div class="mt-3">
                <button class="btn btn-secondary" onclick="downloadComplianceReport()">Baixar Relatório de Conformidade</button>
            </div>
        `;
    } else {
        statusElement.className = 'mt-4 p-3 border rounded bg-yellow-100 text-center';
        statusElement.innerHTML = `
            <h4 class="font-medium text-yellow-800 mb-2">⚠️ Conformidade Parcial</h4>
            <p>Complete todos os itens do checklist para garantir total conformidade com as diretrizes éticas e legais.</p>
        `;
    }
}

// Função para baixar relatório de conformidade (simulada)

// Adicionar tooltips explicativos para termos técnicos
function initEthicsTooltips() {
    const ethicsTerms = document.querySelectorAll('#etica-legal .ethics-term');
    
    ethicsTerms.forEach(term => {
        term.addEventListener('mouseover', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'ethics-tooltip';
            tooltip.textContent = term.getAttribute('data-definition');
            
            // Posicionar tooltip abaixo do termo
            const rect = term.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.bottom + 10) + 'px';
            
            document.body.appendChild(tooltip);
            
            // Remover tooltip ao retirar o mouse
            term.addEventListener('mouseout', function() {
                document.querySelectorAll('.ethics-tooltip').forEach(t => t.remove());
            });
        });
    });
}

// Função para expandir/colapsar exemplos de conformidade LGPD

// Função para mostrar um popup informativo sobre um conceito específico

// Função para verificar a conformidade de um modelo de IA específico

// Função para gerar um plano de ação detalhado

// Adicionar estas funções ao script principal
document.addEventListener('DOMContentLoaded', function() {
    const existingInit = window.initEticaLegalSection;
    window.initEticaLegalSection = function() {
        if (existingInit) existingInit();
        
        // Inicializar tooltips
        initEthicsTooltips();
        
        // Adicionar eventos aos botões de conceitos éticos
        const conceptButtons = document.querySelectorAll('[data-concept]');
        conceptButtons.forEach(button => {
            button.addEventListener('click', function() {
                const concept = this.getAttribute('data-concept');
                showEthicalConcept(concept);
            });
        });
    };
});

// Função para gerar recomendações personalizadas com base na pontuação
function generateRecommendations(level, strongAreas, weakAreas, areas) {
    const recommendationContainer = document.querySelector('.recommendation-content');
    let recommendationsHTML = '';
    
    // Recomendações gerais baseadas no nível
    switch(level) {
        case 'FASE INICIAL':
            recommendationsHTML += `
                <div class="recommendation-section">
                    <h5>Sua empresa ainda precisa construir as bases para implementar IA</h5>
                    <p>Recomendação: Foque primeiro em digitalizar seus processos principais e organizar seus dados em sistemas digitais antes de investir em IA.</p>
                    <div class="recommendation-action">
                        <strong>Próximos passos:</strong>
                        <ul>
                            <li>Migre processos em papel para planilhas digitais</li>
                            <li>Adote um sistema de gestão básico (mesmo gratuito)</li>
                            <li>Desenvolva competências digitais básicas na equipe</li>
                            <li>Experimente ferramentas gratuitas como ChatGPT para criar conteúdo básico</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
        case 'EM PREPARAÇÃO':
            recommendationsHTML += `
                <div class="recommendation-section">
                    <h5>Você tem algumas bases para começar, mas ainda há pontos importantes a desenvolver</h5>
                    <p>Recomendação: Selecione UMA área específica com dados já organizados para implementar um projeto piloto de IA simples.</p>
                    <div class="recommendation-action">
                        <strong>Próximos passos:</strong>
                        <ul>
                            <li>Escolha uma ferramenta de IA pronta para uso em uma área com dados estruturados</li>
                            <li>Implemente um chatbot simples ou automação de e-mail marketing</li>
                            <li>Meça resultados para justificar expansão</li>
                            <li>Capacite a equipe com treinamentos básicos em ferramentas digitais</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
        case 'PRONTO PARA COMEÇAR':
            recommendationsHTML += `
                <div class="recommendation-section">
                    <h5>Sua empresa tem boa preparação para implementar IA com sucesso</h5>
                    <p>Recomendação: Siga o plano de 90 dias deste guia e comece com 2-3 áreas prioritárias identificadas na sua avaliação.</p>
                    <div class="recommendation-action">
                        <strong>Próximos passos:</strong>
                        <ul>
                            <li>Implemente soluções de personalização de marketing com IA</li>
                            <li>Automatize fluxos de trabalho entre sistemas usando ferramentas como Zapier ou Make</li>
                            <li>Treine a equipe em ferramentas de produtividade com IA</li>
                            <li>Desenvolva uma estratégia de dados mais avançada</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
        case 'AVANÇADO':
            recommendationsHTML += `
                <div class="recommendation-section">
                    <h5>Sua empresa está muito bem posicionada para se beneficiar de IA</h5>
                    <p>Recomendação: Crie uma estratégia integrada de IA para múltiplas áreas do negócio e considere soluções mais personalizadas.</p>
                    <div class="recommendation-action">
                        <strong>Próximos passos:</strong>
                        <ul>
                            <li>Desenvolva soluções personalizadas para seu negócio específico</li>
                            <li>Explore tecnologias mais avançadas como previsão de demanda com machine learning</li>
                            <li>Forme uma equipe ou encontre parceiros especializados em IA</li>
                            <li>Integre diferentes soluções de IA para criar um ecossistema tecnológico</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
    }
    
    // Recomendações específicas para áreas fracas
    if (weakAreas.length > 0) {
        recommendationsHTML += `
            <div class="recommendation-section">
                <h5>Recomendações específicas para áreas a melhorar</h5>
                <div class="recommendation-items">
        `;
        
        weakAreas.forEach(area => {
            switch(area) {
                case 'Dados e Infraestrutura':
                    recommendationsHTML += `
                        <div class="recommendation-item">
                            <h6>Dados e Infraestrutura</h6>
                            <p>Você precisa construir uma base sólida de dados digitais antes de implementar IA:</p>
                            <ul>
                                <li>Comece digitalizando documentos em papel e crie planilhas estruturadas</li>
                                <li>Adote um sistema de gestão, mesmo que básico (existem opções gratuitas)</li>
                                <li>Melhore sua conexão com a internet e infraestrutura de dispositivos</li>
                                <li>Crie padrões para seus dados (nomenclatura, formatos, armazenamento)</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'Processos e Operações':
                    recommendationsHTML += `
                        <div class="recommendation-item">
                            <h6>Processos e Operações</h6>
                            <p>Otimize e documente seus processos antes de automatizá-los:</p>
                            <ul>
                                <li>Mapeie processos atuais, identificando entradas, saídas e gargalos</li>
                                <li>Elimine etapas redundantes antes de aplicar IA</li>
                                <li>Crie documentação clara dos processos principais</li>
                                <li>Estabeleça métricas para medir desempenho antes e depois da automação</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'Pessoas e Cultura':
                    recommendationsHTML += `
                        <div class="recommendation-item">
                            <h6>Pessoas e Cultura</h6>
                            <p>Desenvolva as competências e a mentalidade da equipe:</p>
                            <ul>
                                <li>Ofereça treinamentos básicos em ferramentas digitais</li>
                                <li>Identifique um "campeão digital" na equipe para liderar iniciativas</li>
                                <li>Promova uma cultura de experimentação e aprendizado contínuo</li>
                                <li>Comunique claramente os benefícios pessoais da tecnologia para cada colaborador</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'Recursos e Preparo':
                    recommendationsHTML += `
                        <div class="recommendation-item">
                            <h6>Recursos e Preparo</h6>
                            <p>Planeje seus investimentos em tecnologia estrategicamente:</p>
                            <ul>
                                <li>Reserve pelo menos 2-3 horas semanais para aprender e implementar novas ferramentas</li>
                                <li>Comece com soluções gratuitas ou de baixo custo para validar o conceito</li>
                                <li>Defina métricas claras para avaliar o retorno de cada investimento</li>
                                <li>Identifique processos críticos onde o ganho de eficiência trará retorno imediato</li>
                            </ul>
                        </div>
                    `;
                    break;
            }
        });
        
        recommendationsHTML += `
                </div>
            </div>
        `;
    }
    
    // Sugestões de ferramentas baseadas no nível e áreas fortes
    recommendationsHTML += `
        <div class="recommendation-section">
            <h5>Ferramentas de IA recomendadas para seu perfil</h5>
            <div class="tool-recommendations">
    `;
    
    // Determinar categoria de ferramentas com base no nível e áreas fortes
    let recommendedTools = [];
    
    if (level === 'FASE INICIAL') {
        recommendedTools = [
            { name: 'Google Workspace', description: 'Suite completa para digitalização de documentos e colaboração', price: 'Gratuito / A partir de R$24/mês' },
            { name: 'Trello', description: 'Gestão visual de tarefas e projetos com automações básicas', price: 'Gratuito / A partir de R$45/mês' },
            { name: 'ChatGPT', description: 'IA generativa para criar conteúdo e automatizar redação', price: 'Gratuito / Plus por US$20/mês' }
        ];
    } else if (level === 'EM PREPARAÇÃO') {
        if (strongAreas.includes('Dados e Infraestrutura')) {
            recommendedTools.push({ name: 'Zoho Analytics', description: 'Análise de dados empresariais com recursos de IA', price: 'A partir de R$200/mês' });
        }
        if (strongAreas.includes('Processos e Operações')) {
            recommendedTools.push({ name: 'Make (Integromat)', description: 'Automação de fluxos de trabalho sem código', price: 'Gratuito / A partir de R$100/mês' });
        }
        if (strongAreas.includes('Pessoas e Cultura')) {
            recommendedTools.push({ name: 'Gupy', description: 'Recrutamento e seleção com IA', price: 'A partir de R$290/mês' });
        }
        
        // Adicionar ferramenta genérica se nenhuma específica foi adicionada
        if (recommendedTools.length === 0) {
            recommendedTools = [
                { name: 'ManyChat', description: 'Chatbots para WhatsApp e redes sociais', price: 'Gratuito / A partir de R$15/mês' },
                { name: 'Canva Pro', description: 'Design com recursos de IA', price: 'R$50/mês' }
            ];
        }
    } else if (level === 'PRONTO PARA COMEÇAR' || level === 'AVANÇADO') {
        recommendedTools = [
            { name: 'HubSpot', description: 'CRM com recursos avançados de IA para marketing, vendas e suporte', price: 'Gratuito / A partir de R$500/mês' },
            { name: 'Zapier', description: 'Automação avançada entre diferentes plataformas', price: 'Gratuito / A partir de R$200/mês' },
            { name: 'Jasper', description: 'IA avançada para criação de conteúdo', price: 'A partir de R$300/mês' }
        ];
    }
    
    // Adicionar ferramentas recomendadas ao HTML
    recommendedTools.forEach(tool => {
        recommendationsHTML += `
            <div class="tool-card">
                <h6 class="tool-name">${tool.name}</h6>
                <p class="tool-description">${tool.description}</p>
                <div class="tool-price">${tool.price}</div>
            </div>
        `;
    });
    
    recommendationsHTML += `
            </div>
        </div>
    `;
    
    // Atualizar o conteúdo das recomendações
    recommendationContainer.innerHTML = recommendationsHTML;
}

// Função para gerar roadmap personalizado
function generateRoadmap(level, weakAreas, allAreas) {
    // Ordenar áreas da mais fraca para a mais forte para priorização
    allAreas.sort((a, b) => a.score - b.score);
    
    // Definir etapas do roadmap com base no nível e áreas fracas
    const step1Element = document.getElementById('roadmapStep1');
    const step2Element = document.getElementById('roadmapStep2');
    const step3Element = document.getElementById('roadmapStep3');
    
    // Etapa 1: Foco na área mais fraca ou na preparação básica
    if (allAreas[0].score <= 1) {
        // Se tiver uma área muito fraca, focar nela primeiro
        switch (allAreas[0].name) {
            case 'Dados e Infraestrutura':
                step1Element.innerHTML = `
                    <h5>Digitalização e Organização de Dados (1-2 meses)</h5>
                    <p>Focando na base fundamental: seus dados.</p>
                    <ul>
                        <li>Migre documentos em papel para formatos digitais</li>
                        <li>Padronize a estrutura das informações (planilhas, bancos de dados)</li>
                        <li>Implemente um sistema básico de armazenamento na nuvem</li>
                        <li>Crie procedimentos para manter dados atualizados e organizados</li>
                    </ul>
                `;
                break;
            case 'Processos e Operações':
                step1Element.innerHTML = `
                    <h5>Mapeamento e Otimização de Processos (1-2 meses)</h5>
                    <p>Documentando e melhorando os fluxos de trabalho.</p>
                    <ul>
                        <li>Identifique e documente os 3-5 processos mais importantes</li>
                        <li>Elimine etapas redundantes e simplifique fluxos</li>
                        <li>Crie indicadores de desempenho para cada processo</li>
                        <li>Identifique tarefas repetitivas que consomem mais tempo</li>
                    </ul>
                `;
                break;
            case 'Pessoas e Cultura':
                step1Element.innerHTML = `
                    <h5>Desenvolvimento de Competências Digitais (1-2 meses)</h5>
                    <p>Preparando sua equipe para adoção de novas tecnologias.</p>
                    <ul>
                        <li>Identifique gaps de conhecimento digital na equipe</li>
                        <li>Ofereça treinamentos básicos em ferramentas digitais</li>
                        <li>Designe um "campeão digital" para liderar iniciativas</li>
                        <li>Promova discussões sobre benefícios da tecnologia</li>
                    </ul>
                `;
                break;
            case 'Recursos e Preparo':
                step1Element.innerHTML = `
                    <h5>Planejamento de Recursos Tecnológicos (1-2 meses)</h5>
                    <p>Alocando tempo e orçamento para inovação.</p>
                    <ul>
                        <li>Reserve tempo semanal dedicado à experimentação de novas ferramentas</li>
                        <li>Defina um orçamento pequeno mas consistente para tecnologia</li>
                        <li>Pesquise e experimente soluções gratuitas ou de baixo custo</li>
                        <li>Priorize áreas críticas onde a tecnologia trará mais valor</li>
                    </ul>
                `;
                break;
        }
    } else {
        // Se não tiver áreas muito fracas, começar com um projeto piloto simples
        step1Element.innerHTML = `
            <h5>Projeto Piloto de IA Simples (1 mês)</h5>
            <p>Experimentando uma solução básica de IA em área de baixo risco.</p>
            <ul>
                <li>Escolha uma ferramenta pronta para uso com trial gratuito</li>
                <li>Aplique em um processo não-crítico para aprendizado</li>
                <li>Documente resultados e lições aprendidas</li>
                <li>Compartilhe sucessos iniciais com toda a equipe</li>
            </ul>
        `;
    }
    
    // Etapa 2: Implementação inicial ou expansão
    if (level === 'FASE INICIAL' || level === 'EM PREPARAÇÃO') {
        step2Element.innerHTML = `
            <h5>Primeira Implementação de IA (2-3 meses)</h5>
            <p>Aplicando IA em uma área específica com resultado tangível.</p>
            <ul>
                <li>Escolha UMA área com dados já organizados</li>
                <li>Implemente uma solução simples (ex: automação de email, chatbot básico)</li>
                <li>Defina métricas claras para medir sucesso</li>
                <li>Treine pelo menos dois colaboradores no uso da ferramenta</li>
            </ul>
        `;
    } else {
        step2Element.innerHTML = `
            <h5>Expansão Estratégica (2-3 meses)</h5>
            <p>Ampliando o uso de IA para múltiplas áreas.</p>
            <ul>
                <li>Implemente 2-3 soluções integradas em diferentes departamentos</li>
                <li>Crie um "centro de excelência" interno para IA</li>
                <li>Desenvolva uma estratégia de dados mais robusta</li>
                <li>Comece a conectar diferentes sistemas usando automações</li>
            </ul>
        `;
    }
    
    // Etapa 3: Expansão ou Aprimoramento
    if (level === 'FASE INICIAL') {
        step3Element.innerHTML = `
            <h5>Expansão Gradual (3-6 meses)</h5>
            <p>Ampliando o uso de IA com base nos primeiros sucessos.</p>
            <ul>
                <li>Expanda a solução inicial para mais áreas</li>
                <li>Implemente uma segunda ferramenta de IA em outra área</li>
                <li>Inicie treinamentos mais avançados para a equipe</li>
                <li>Comece a medir o ROI das implementações</li>
            </ul>
        `;
    } else if (level === 'EM PREPARAÇÃO' || level === 'PRONTO PARA COMEÇAR') {
        step3Element.innerHTML = `
            <h5>Integração e Otimização (3-6 meses)</h5>
            <p>Conectando diferentes soluções de IA para maior impacto.</p>
            <ul>
                <li>Integre diferentes ferramentas usando plataformas como Zapier</li>
                <li>Implemente análise de dados avançada para decisões estratégicas</li>
                <li>Crie painéis de monitoramento de desempenho das soluções</li>
                <li>Desenvolva uma cultura de melhoria contínua baseada em dados</li>
            </ul>
        `;
    } else {
        step3Element.innerHTML = `
            <h5>Inovação Avançada (3-6 meses)</h5>
            <p>Explorando fronteiras mais avançadas da IA.</p>
            <ul>
                <li>Considere desenvolver soluções personalizadas para seu negócio</li>
                <li>Explore áreas como Machine Learning para previsões específicas</li>
                <li>Estabeleça parcerias com especialistas ou startups de IA</li>
                <li>Implemente uma estratégia de dados completa para alimentar modelos avançados</li>
            </ul>
        `;
    }
}

// Adicione este código ao seu arquivo script.js

// Dados de implementação passo a passo para cada aplicação
const implementationSteps = {
    "chatbot": {
        title: "Implementação de Chatbots e Assistentes Virtuais",
        steps: [
            {
                title: "Mapeamento de perguntas frequentes",
                content: `
                <p>Identifique as perguntas que seus clientes fazem com mais frequência, para criar uma base de conhecimento eficaz:</p>
                <ul>
                    <li>Analise registros de atendimento dos últimos 3 meses e identifique as 20-30 perguntas mais comuns</li>
                    <li>Entreviste sua equipe de atendimento para capturar conhecimento não documentado</li>
                    <li>Organize as perguntas em categorias lógicas (ex: entrega, produtos, pagamentos)</li>
                    <li>Prepare respostas padronizadas para cada pergunta, sendo claro e conciso</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Grave um dia de atendimento ao cliente para identificar padrões de perguntas que sua equipe pode não perceber conscientemente.</p>
                </div>
                `
            },
            {
                title: "Escolha de plataforma",
                content: `
                <p>Selecione a ferramenta mais adequada para seu caso específico:</p>
                <ul>
                    <li>Defina seu canal prioritário (WhatsApp, site, redes sociais)</li>
                    <li>Avalie 2-3 plataformas com versões gratuitas ou trials (ManyChat, Tidio, Dialogflow)</li>
                    <li>Verifique integrações nativas com seus sistemas atuais</li>
                    <li>Selecione com base em facilidade de uso e adequação ao seu canal principal</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Para WhatsApp, ManyChat é uma das opções mais acessíveis. Para sites, considere Tidio ou Tawk.to por sua facilidade de implementação.</p>
                </div>
                `
            },
            {
                title: "Criação do fluxo de conversa",
                content: `
                <p>Construa uma estrutura lógica para as interações do chatbot:</p>
                <ul>
                    <li>Desenhe um fluxograma simples com saudação inicial, menu de opções e respostas</li>
                    <li>Inclua sempre um caminho para contato humano quando necessário</li>
                    <li>Defina mensagens de fallback para quando o bot não entender a pergunta</li>
                    <li>Crie fluxos específicos para suas categorias principais de perguntas</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Comece com um menu simples de botões em vez de perguntas abertas para facilitar a navegação do usuário e reduzir erros.</p>
                </div>
                `
            },
            {
                title: "Configuração e teste",
                content: `
                <p>Configure o chatbot e teste-o exaustivamente antes do lançamento:</p>
                <ul>
                    <li>Configure o bot na plataforma escolhida seguindo o tutorial oficial</li>
                    <li>Adicione suas perguntas e respostas frequentes estruturadas</li>
                    <li>Faça testes internos com sua equipe simulando diferentes cenários</li>
                    <li>Corrija problemas e refine respostas com base no feedback</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Peça a pessoas que não participaram do desenvolvimento para testar o chatbot - elas encontrarão falhas que você não percebeu.</p>
                </div>
                `
            },
            {
                title: "Lançamento e monitoramento",
                content: `
                <p>Implemente o chatbot gradualmente e monitore seu desempenho:</p>
                <ul>
                    <li>Inicie com um grupo pequeno de clientes (10-20%)</li>
                    <li>Comunique claramente que é um assistente virtual, não um humano</li>
                    <li>Monitore diariamente as interações nas primeiras duas semanas</li>
                    <li>Colete métricas iniciais (taxa de resolução, satisfação, tempo economizado)</li>
                    <li>Expanda gradualmente para toda base de clientes</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Configure alertas para quando o chatbot não conseguir responder várias perguntas em sequência, indicando um cliente frustrado que precisa de atendimento humano urgente.</p>
                </div>
                `
            }
        ]
    },
    "personalizacao": {
        title: "Implementação de Personalização de Conteúdo",
        steps: [
            {
                title: "Unificação dos dados dos clientes",
                content: `
                <p>Reúna todos os dados de clientes em um único lugar para viabilizar a personalização:</p>
                <ul>
                    <li>Crie uma planilha ou banco de dados centralizado com informações de clientes</li>
                    <li>Consolide dados de diferentes fontes (e-commerce, CRM, email marketing)</li>
                    <li>Padronize informações como nomes, endereços e categorias</li>
                    <li>Enriqueça perfis com histórico de compras, preferências e interações</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Use uma ferramenta como Airtable ou Google Sheets para começar, antes de investir em soluções mais complexas.</p>
                </div>
                `
            },
            {
                title: "Segmentação inicial",
                content: `
                <p>Divida seus clientes em grupos com características semelhantes:</p>
                <ul>
                    <li>Divida clientes em 3-5 grupos baseados em comportamento de compra</li>
                    <li>Crie segmentos como "compradores frequentes", "clientes dormentes", "alto valor"</li>
                    <li>Identifique padrões de interesse por categoria de produto</li>
                    <li>Documente características-chave de cada segmento para uso na personalização</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>A regra RFM (Recência, Frequência, Valor Monetário) é uma forma simples e eficaz de segmentar clientes.</p>
                </div>
                `
            },
            {
                title: "Implementação da ferramenta",
                content: `
                <p>Configure a plataforma que fará a personalização automatizada:</p>
                <ul>
                    <li>Selecione uma plataforma que se integre ao seu canal principal (email, site)</li>
                    <li>Configure regras de segmentação na ferramenta baseadas em seus grupos</li>
                    <li>Importe seus dados de clientes (verifique conformidade com LGPD)</li>
                    <li>Estabeleça gatilhos para envio de conteúdo personalizado (ex: abandono de carrinho)</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Ferramentas como Mailchimp, RD Station ou ActiveCampaign oferecem recursos de personalização acessíveis para pequenas empresas.</p>
                </div>
                `
            },
            {
                title: "Criação de conteúdo adaptável",
                content: `
                <p>Prepare conteúdo que possa ser personalizado para diferentes segmentos:</p>
                <ul>
                    <li>Desenvolva templates de comunicação com elementos personalizáveis</li>
                    <li>Crie variações específicas para cada segmento principal</li>
                    <li>Inclua campos dinâmicos para nome, produtos de interesse, ofertas relevantes</li>
                    <li>Prepare conteúdo para diferentes etapas da jornada do cliente</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Use ferramentas de IA como ChatGPT para gerar variações de textos adaptados a diferentes públicos.</p>
                </div>
                `
            },
            {
                title: "Teste A/B e refinamento",
                content: `
                <p>Compare resultados e otimize continuamente sua estratégia:</p>
                <ul>
                    <li>Envie versões personalizadas vs. genéricas para amostras similares</li>
                    <li>Meça diferenças em taxa de abertura, cliques e conversões</li>
                    <li>Analise quais elementos personalizados geram melhor desempenho</li>
                    <li>Refine progressivamente suas regras de segmentação e conteúdo</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Teste um elemento por vez (assunto, imagem, oferta) para identificar exatamente o que está gerando melhores resultados.</p>
                </div>
                `
            }
        ]
    },
    "financeiro": {
        title: "Implementação de Automatização de Processos Financeiros",
        steps: [
            {
                title: "Mapeamento dos processos financeiros",
                content: `
                <p>Identifique quais processos podem e devem ser automatizados:</p>
                <ul>
                    <li>Documente detalhadamente seus processos financeiros atuais</li>
                    <li>Identifique tarefas repetitivas como conciliação bancária, categorização de despesas</li>
                    <li>Meça o tempo gasto em cada atividade e frequência de erros</li>
                    <li>Priorize processos com maior volume, repetitividade e impacto em caso de erro</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Grave alguém executando o processo e note quando ele diz frases como "eu sempre tenho que..." - estes são candidatos perfeitos para automação.</p>
                </div>
                `
            },
            {
                title: "Organização dos dados financeiros",
                content: `
                <p>Padronize e estruture seus dados financeiros para facilitar a automação:</p>
                <ul>
                    <li>Padronize nomenclaturas de categorias financeiras e centros de custo</li>
                    <li>Crie estrutura consistente para nomes de fornecedores e clientes</li>
                    <li>Defina formato padrão para datas, valores e descrições de transações</li>
                    <li>Organize documentos fiscais em sistema de arquivamento consistente</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Crie uma lista de nomenclaturas padronizadas e compartilhe com toda a equipe antes de implementar a automação.</p>
                </div>
                `
            },
            {
                title: "Seleção da ferramenta adequada",
                content: `
                <p>Escolha a solução mais adequada às suas necessidades específicas:</p>
                <ul>
                    <li>Avalie soluções que integram com seu sistema contábil/bancário atual</li>
                    <li>Compare recursos de automação específicos para seus processos prioritários</li>
                    <li>Verifique se a ferramenta oferece recurso de aprendizado com correções</li>
                    <li>Considere a facilidade de implementação e suporte disponível</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Ferramentas como Conta Azul, QuickBooks e Nibo oferecem recursos de automação financeira com IA acessíveis para PMEs.</p>
                </div>
                `
            },
            {
                title: "Implementação inicial e treinamento",
                content: `
                <p>Configure e treine a IA com seus dados e processos específicos:</p>
                <ul>
                    <li>Configure regras básicas de categorização e reconhecimento de padrões</li>
                    <li>Importe dados históricos para treinamento do sistema (3-6 meses)</li>
                    <li>Instrua a IA com exemplos de classificações corretas para casos comuns</li>
                    <li>Treine as pessoas responsáveis pela validação e supervisão</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Quanto mais dados históricos de qualidade você alimentar no sistema, mais precisa será a automação desde o início.</p>
                </div>
                `
            },
            {
                title: "Validação e expansão gradual",
                content: `
                <p>Implemente gradualmente e valide os resultados antes de expandir:</p>
                <ul>
                    <li>Comece com um processo específico (ex: conciliação bancária)</li>
                    <li>Opere em paralelo com processo manual para validação por 2-4 semanas</li>
                    <li>Compare resultados e faça ajustes nas regras e configurações</li>
                    <li>Expanda gradualmente para outros processos financeiros</li>
                    <li>Estabeleça protocolos para casos de exceção e revisão periódica</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Mantenha um registro de todas as exceções e casos onde a automação falhou - estes são valiosos para treinar o sistema e melhorar a precisão.</p>
                </div>
                `
            }
        ]
    },
    "rh": {
        title: "Implementação de Recrutamento e Seleção Aprimorados com IA",
        steps: [
            {
                title: "Padronização das descrições de vagas",
                content: `
                <p>Crie templates consistentes que facilitem a avaliação automatizada:</p>
                <ul>
                    <li>Crie templates com estrutura consistente para todas as vagas</li>
                    <li>Defina claramente requisitos, responsabilidades e competências necessárias</li>
                    <li>Use linguagem precisa e mensurável para facilitar a avaliação automatizada</li>
                    <li>Remova jargões, ambiguidades e termos que possam criar viés</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Use verbos de ação e métricas específicas ao invés de termos vagos - "gerenciar equipe de 5 pessoas" em vez de "bom líder".</p>
                </div>
                `
            },
            {
                title: "Organização da base de currículos",
                content: `
                <p>Prepare sua base de dados de candidatos para análise automatizada:</p>
                <ul>
                    <li>Digitalize currículos físicos e centralize em formato processável</li>
                    <li>Padronize a estrutura de dados (experiência, formação, habilidades)</li>
                    <li>Remova informações que possam causar viés (foto, idade, gênero)</li>
                    <li>Organize por competências e experiências relevantes, não apenas cargos</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Ferramentas OCR (reconhecimento ótico de caracteres) podem ajudar a digitalizar currículos antigos em papel ou PDF não processável.</p>
                </div>
                `
            },
            {
                title: "Configuração da ferramenta de IA",
                content: `
                <p>Selecione e configure a plataforma para seu processo específico:</p>
                <ul>
                    <li>Selecione plataforma com recursos de triagem, correspondência e análise</li>
                    <li>Configure critérios de avaliação alinhados às suas necessidades</li>
                    <li>Adapte os pesos das competências de acordo com prioridades da empresa</li>
                    <li>Defina regras para pontuação de candidatos baseadas em requisitos-chave</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Ferramentas como Gupy, Jobecam e Kenoby oferecem recursos de IA para recrutamento acessíveis para empresas brasileiras.</p>
                </div>
                `
            },
            {
                title: "Treinamento e calibragem",
                content: `
                <p>Treine o sistema com dados de contratações bem-sucedidas anteriores:</p>
                <ul>
                    <li>Alimente o sistema com exemplos de contratações bem-sucedidas anteriores</li>
                    <li>Crie perfis ideais para diferentes funções baseados em top performers</li>
                    <li>Ajuste os parâmetros com feedback de recrutadores experientes</li>
                    <li>Teste com uma amostra de currículos já conhecidos para validar resultados</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Monte um "currículo ideal" baseado em seus melhores funcionários para cada posição-chave, ajudando o sistema a reconhecer padrões de sucesso.</p>
                </div>
                `
            },
            {
                title: "Integração ao processo existente",
                content: `
                <p>Defina como a IA se integrará ao seu processo atual de RH:</p>
                <ul>
                    <li>Defina quais etapas serão automatizadas e quais permanecerão humanas</li>
                    <li>Estabeleça pontos de validação humana para decisões críticas</li>
                    <li>Crie processo para feedback contínuo sobre qualidade das recomendações</li>
                    <li>Desenvolva comunicação transparente com candidatos sobre o uso de IA</li>
                    <li>Implemente monitoramento para evitar vieses e garantir diversidade</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Use a IA principalmente para triagem inicial e tarefas repetitivas, mantendo o julgamento humano para avaliações mais subjetivas e decisões finais.</p>
                </div>
                `
            }
        ]
    },
    "conteudo": {
        title: "Implementação de Criação de Conteúdo com IA",
        steps: [
            {
                title: "Definição da voz e identidade da marca",
                content: `
                <p>Estabeleça diretrizes claras para manter consistência no conteúdo gerado por IA:</p>
                <ul>
                    <li>Documente o tom, valores e linguagem da sua marca</li>
                    <li>Crie um guia de estilo com exemplos concretos do que fazer e evitar</li>
                    <li>Reúna posts bem-sucedidos anteriores como referência</li>
                    <li>Defina personas claras do seu público-alvo para orientar o conteúdo</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Crie uma lista de palavras e frases que sua marca usa e evita, para garantir que o conteúdo gerado por IA mantenha a identidade adequada.</p>
                </div>
                `
            },
            {
                title: "Identificação dos tipos de conteúdo prioritários",
                content: `
                <p>Determine quais conteúdos são ideais para geração assistida por IA:</p>
                <ul>
                    <li>Liste os formatos mais utilizados (posts, emails, blogs, legendas)</li>
                    <li>Analise quais consumem mais tempo da sua equipe</li>
                    <li>Identifique conteúdos recorrentes que poderiam ser padronizados</li>
                    <li>Priorize com base em volume necessário e complexidade</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Comece com conteúdos de alto volume e menor complexidade criativa, como legendas de produtos ou posts informativos, antes de avançar para conteúdos mais estratégicos.</p>
                </div>
                `
            },
            {
                title: "Seleção das ferramentas adequadas",
                content: `
                <p>Escolha as ferramentas mais adequadas para seus tipos específicos de conteúdo:</p>
                <ul>
                    <li>Escolha ferramentas específicas para seus formatos prioritários</li>
                    <li>Para textos gerais, avalie ChatGPT, Copy.ai ou Jasper</li>
                    <li>Para imagens e designs, considere Canva com IA ou Midjourney</li>
                    <li>Para vídeos, verifique ferramentas como InVideo ou Synthesia</li>
                    <li>Garanta que as ferramentas se integrem ao seu fluxo de trabalho</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>O ChatGPT (versão gratuita) é um ótimo ponto de partida para experimentação antes de investir em ferramentas pagas mais especializadas.</p>
                </div>
                `
            },
            {
                title: "Criação de templates e prompts eficazes",
                content: `
                <p>Desenvolva instruções claras para obter os melhores resultados das ferramentas de IA:</p>
                <ul>
                    <li>Desenvolva prompts específicos para cada tipo de conteúdo</li>
                    <li>Inclua instruções claras sobre tom, comprimento e objetivo</li>
                    <li>Crie biblioteca de prompts para situações recorrentes</li>
                    <li>Documente exemplos de bons e maus resultados para referência</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Seja específico nos prompts - "Crie um post no Instagram sobre nosso novo produto X para mães de 30-45 anos, destacando benefícios Y e Z, usando tom informal e call-to-action para compra" é muito mais eficaz que "Faça um post sobre nosso produto".</p>
                </div>
                `
            },
            {
                title: "Integração ao fluxo de trabalho",
                content: `
                <p>Estabeleça processos claros para usar IA na sua rotina de criação de conteúdo:</p>
                <ul>
                    <li>Defina processo claro de geração > revisão > aprovação > publicação</li>
                    <li>Estabeleça diretrizes para edição humana dos resultados da IA</li>
                    <li>Crie calendário editorial que combine conteúdo automatizado e manual</li>
                    <li>Implemente sistema de feedback para melhorar continuamente os prompts</li>
                    <li>Treine a equipe para usar a IA como ferramenta de apoio, não substituto</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Reserve um tempo fixo semanal para gerar conteúdo em lote com IA, permitindo melhor planejamento e consistência.</p>
                </div>
                `
            }
        ]
    },
    "operacoes": {
        title: "Implementação de Gestão de Estoque Inteligente",
        steps: [
            {
                title: "Organização dos dados históricos",
                content: `
                <p>Prepare uma base sólida de dados para alimentar o sistema de IA:</p>
                <ul>
                    <li>Colete 12-24 meses de dados de vendas, níveis de estoque e lead times</li>
                    <li>Padronize formatos de SKUs, categorias e unidades de medida</li>
                    <li>Identifique e corrija inconsistências nos registros históricos</li>
                    <li>Organize dados em planilha estruturada ou sistema de gestão</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Se não tiver histórico suficiente, comece a registrar dados agora de forma estruturada - em 3-6 meses você terá informações suficientes para começar.</p>
                </div>
                `
            },
            {
                title: "Categorização ABC de produtos",
                content: `
                <p>Priorize seu inventário para uma gestão mais eficiente:</p>
                <ul>
                    <li>Classifique produtos por volume de vendas e margem de contribuição</li>
                    <li>Identifique itens A (alta importância), B (média) e C (baixa)</li>
                    <li>Analise sazonalidades e tendências por categoria</li>
                    <li>Defina níveis prioritários de serviço para cada categoria</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Tipicamente, 20% dos seus produtos (categoria A) representam 80% das vendas - foque neles primeiro para maximizar o impacto.</p>
                </div>
                `
            },
            {
                title: "Seleção da ferramenta adequada",
                content: `
                <p>Escolha uma solução de gestão de estoque com recursos de IA compatível com seu negócio:</p>
                <ul>
                    <li>Escolha solução que se integre ao seu sistema atual (ERP/PDV)</li>
                    <li>Verifique capacidade de lidar com sazonalidades e promoções</li>
                    <li>Avalie requisitos de dados e facilidade de implementação</li>
                    <li>Compare custos vs. benefícios potenciais para seu volume</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Ferramentas como Estoque IA, Linx Commerce e TOTVS Fluig oferecem recursos de previsão de demanda acessíveis para diferentes portes de empresa.</p>
                </div>
                `
            },
            {
                title: "Configuração e treinamento inicial",
                content: `
                <p>Configure a ferramenta de acordo com as particularidades do seu negócio:</p>
                <ul>
                    <li>Defina parâmetros específicos do seu negócio (lead times, margens de segurança)</li>
                    <li>Configure regras para sazonalidades conhecidas e eventos especiais</li>
                    <li>Importe dados históricos para treinamento do modelo</li>
                    <li>Estabeleça limites de pedidos mínimos e máximos por segurança</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Documente detalhadamente seus parâmetros de configuração e razões para cada escolha - isso facilitará ajustes futuros.</p>
                </div>
                `
            },
            {
                title: "Implementação gradual e validação",
                content: `
                <p>Implemente por fases, validando resultados em cada etapa:</p>
                <ul>
                    <li>Comece aplicando apenas para produtos categoria A (mais importantes)</li>
                    <li>Compare previsões do sistema com estimativas manuais experientes</li>
                    <li>Monitore desvios e ajuste parâmetros conforme necessário</li>
                    <li>Implemente alertas para situações atípicas que exigem intervenção</li>
                    <li>Expanda gradualmente para categorias B e C após validação inicial</li>
                </ul>
                <div class="implementation-tip">
                    <div class="implementation-tip-title">Dica:</div>
                    <p>Mantenha um registro das previsões automáticas vs. resultados reais para avaliar a precisão do sistema e ajustá-lo continuamente.</p>
                </div>
                `
            }
        ]
    }
};

// Função para abrir o modal de implementação
function openImplementationModal(id) {
    const implementationData = implementationSteps[id];
    if (!implementationData) return;
    
    // Preencher o título
    document.getElementById('implementationTitle').textContent = implementationData.title;
    
    // Limpar e preencher o conteúdo
    const modalBody = document.getElementById('implementationBody');
    modalBody.innerHTML = '';
    
    // Adicionar cada passo
    implementationData.steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'implementation-step';
        
        stepElement.innerHTML = `
            <div class="implementation-step-header">
                <div class="implementation-step-number">${index + 1}</div>
                <h4 class="implementation-step-title">${step.title}</h4>
            </div>
            <div class="implementation-step-content">
                ${step.content}
            </div>
        `;
        
        modalBody.appendChild(stepElement);
    });
    
    // Mostrar o modal
    document.getElementById('implementationModal').style.display = 'block';
    
    // Bloquear rolagem do body
    document.body.style.overflow = 'hidden';
}

// Função para fechar o modal
function closeImplementationModal() {
    document.getElementById('implementationModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Fechar o modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('implementationModal');
    if (event.target === modal) {
        closeImplementationModal();
    }
};

// Função para adicionar botões de implementação detalhada a cada card de aplicação
function addImplementationButtons() {
    // Selecionar todos os cards de aplicação
    const appCards = document.querySelectorAll('.aplicacao-card');
    
    appCards.forEach(card => {
        // Identificar categoria da aplicação
        let appId = '';
        if (card.dataset.categoria === 'atendimento') appId = 'chatbot';
        else if (card.dataset.categoria === 'vendas') appId = 'personalizacao';
        else if (card.dataset.categoria === 'financeiro') appId = 'financeiro';
        else if (card.dataset.categoria === 'rh') appId = 'rh';
        else if (card.dataset.categoria === 'conteudo') appId = 'conteudo';
        else if (card.dataset.categoria === 'operacoes') appId = 'operacoes';
        
        if (!appId) return;
        
        // Encontrar o "Ver detalhes" botão e adicionar o botão de implementação após ele
        const detailsButtons = card.querySelectorAll('.ver-mais');
        detailsButtons.forEach(button => {
            const implementationButton = document.createElement('button');
            implementationButton.className = 'ver-implementacao';
            implementationButton.innerHTML = '<i class="fas fa-tools"></i> Ver implementação detalhada';
            implementationButton.onclick = function() {
                openImplementationModal(appId);
            };
            
            button.parentNode.insertBefore(implementationButton, button.nextSibling);
        });
        
        // Adicionar também aos detalhes expandidos
        const detailsContent = card.querySelector('.card-details');
        if (detailsContent) {
            const implementationSection = document.createElement('div');
            implementationSection.className = 'details-section';
            implementationSection.innerHTML = `
                <h4>Implementação Passo a Passo</h4>
                <p>Confira nosso guia detalhado de implementação com instruções específicas.</p>
                <button class="btn btn-primary btn-sm ver-implementacao-detalhada" onclick="openImplementationModal('${appId}')">Ver Implementação Detalhada</button>
            `;
            
            // Inserir antes dos botões de ação
            const actionButtons = detailsContent.querySelector('.action-buttons');
            if (actionButtons) {
                detailsContent.insertBefore(implementationSection, actionButtons);
            } else {
                detailsContent.appendChild(implementationSection);
            }
        }
    });
}

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    addImplementationButtons();
});