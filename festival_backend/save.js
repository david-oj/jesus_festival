 // Genereate QR code
        const qrCode = await generateQRCode(registrationData.fullName, registrationData.email);

        // Create a new student
        const newStudent = new FestivalStudent({
            ...registrationData,
            registrationId: qrCode.registerationId,
        })
        await newStudent.save();

        // Send email
        await sendEmail(
            registrationData.email,
            registrationData.fullName,
            qrCode.qrCodeImageUrl,
            qrCode.registerationId,
        );

        return res.status(201).json({
            message: 'Student created successfully',
            student: {
                id: newStudent._id,
                fullName: newStudent.fullName,
                email: newStudent.email,
                registrationId: newStudent.registrationId,
            },
        });