// async getParticipantsFromAnEvent(req, res) {
  //   try {
  //     const event = await Event.findByPk(req.params.id,{
  //       include: {
  //         model: User,
  //         as: "participants",
  //         through: { attributes: [] },
  //         attributes: ["name"],
  //       },
  //     });
  //     const participants = event.participants.map(participant => participant.name);
  //     // const participantsNames = allEvents.flatMap(event => event.participants
  //     //   .map(participant => participant.name));

  //     return res.json(participants);
  //   } catch (error) {
  //     console.error(error.message);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // },



    // async createDraw(req, res) {
  //   const { event_id, giver_id, receiver_id } = req.body;
  //   try {
  //     const draw = await Draw.create({
  //       event_id,
  //       giver_id,
  //       receiver_id,
  //     });
  //     return res.status(201).json(draw);
  //   } catch (error) {
  //     console.error(error.message);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // },