import Sequelize from 'sequelize';
import Consult from '../models/Consult';
import ConsultResposta from '../models/ConsultResposta';
import Plan from '../models/Plan';
import Respostas from '../models/Respostas';
import databaseConfig from '../../config/database';


class ConsultController {
  async index(req, res) {
    const order = [['created_at', 'desc']];
    const data = await Consult.findAndCountAll({
      where: {
        student_id: req.params.student_id,
      },
      order,
    }).catch(error => {
      console.log(error);
      res.status(400).send(error);
    });

    return res.json({
      consults: data.rows,
      total: data.count,
    });
  }

  async store(req, res) {
    const { respostas, student_id } = req.body;
    const newRecord = await Consult.create({
      student_id,
    });

    const respostasArray = [];

    await Promise.all(respostas.map(async key => {
      const resposta = await Respostas.findByPk(key.id, {
        include: [
          {
            model: Plan,
            as: 'plan',
          },
        ],
      });
      respostasArray.push(key.id);
      await ConsultResposta.create({
        resposta: resposta.dataValues.title,
        pergunta: resposta.dataValues.plan.dataValues.title,
        consult_id: newRecord.dataValues.id,
      });
    }));

    const connection = new Sequelize(databaseConfig);
    const acertos = await connection.query(`select COUNT(rr.results_id) as acertos, r.id, r.title  FROM  results r  inner join results_respostas rr  on r.id = rr.results_id 
                      INNER  join respostas r2 on rr.respostas_id = r2.id where r2.id in(${respostasArray.toString()}) GROUP by  r.id, r.title
                      ORDER BY acertos DESC  LIMIT 1 `,
      { type: Sequelize.QueryTypes.SELECT }
    ).catch(error => {
      console.log(error);
      res.status(400).send(error);
    })

    newRecord.update({
      compromisso: acertos[0].title
    })

    return res.json(newRecord);
  }

  async update(req, res) {
    const {  acaoImediataBaixoControle, compromisso,  comportamento,  acaoImediataAltoControle } = req.body;
    const consult = await Consult.findByPk(req.params.id);

    await consult.update({
      acaoImediataBaixoControle,
      compromisso,
      comportamento,
      acaoImediataAltoControle
    }).catch(error => {
      console.log(error);
      res.status(400).send(error);
    })

    return res.json(consult);
  }

  async result(req, res) {
    const consult = await Consult.findByPk(req.params.id, {
      include: [
        {
          model: ConsultResposta,
          as: 'consult_resposta',
        },
      ],
    });

    return res.json(consult);
  }
  
}

export default new ConsultController();
